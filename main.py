# -*- coding: utf-8 -*-
"""
Local Web File Manager (Standard Library Only)
- Serves a small web UI on localhost
- Step 1: confirm relative path (validated; no escaping base)
- Step 2: show status, create file, write content (with confirmations in UI)
- Opens browser automatically
"""

import html
import json
import os
import re
import threading
import urllib.parse
import webbrowser
from http import HTTPStatus
from http.server import ThreadingHTTPServer, BaseHTTPRequestHandler

BASE_DIR = r"D:\My Progects at python\mohamed-portfolio"
HOST = "127.0.0.1"
PORT = 8765


def normalize_relative(p: str) -> str:
    p = (p or "").strip()
    p = p.replace("/", os.sep).replace("\\", os.sep)
    p = os.path.normpath(p)
    return p


def validate_relative_path(base_dir: str, rel: str) -> tuple[bool, str, str]:
    """
    Returns: (ok, message, full_path)
    """
    if not rel or rel in (".", os.curdir):
        return False, "المسار النسبي فارغ أو غير صالح.", ""

    if "\x00" in rel:
        return False, "المسار يحتوي على محرف غير صالح (NUL).", ""

    if os.path.isabs(rel):
        return False, "ممنوع إدخال مسار مطلق. أدخل مسارًا نسبيًا داخل المشروع فقط.", ""

    if re.match(r"^[a-zA-Z]:", rel):
        return False, "ممنوع استخدام حرف قرص (مثل C:). أدخل مسارًا نسبيًا فقط.", ""

    base = os.path.abspath(base_dir)
    full = os.path.abspath(os.path.join(base, rel))

    try:
        if os.path.commonpath([base, full]) != base:
            return False, "المسار يحاول الخروج خارج مسار المشروع (.. غير مسموح).", ""
    except ValueError:
        return False, "المسار غير صالح بالنسبة لمسار المشروع.", ""

    return True, "تم تأكيد المسار.", full


def file_status(full_path: str) -> dict:
    if not full_path:
        return {"exists": False, "type": "none"}
    if os.path.isfile(full_path):
        return {"exists": True, "type": "file"}
    if os.path.isdir(full_path):
        return {"exists": True, "type": "dir"}
    return {"exists": False, "type": "none"}


INDEX_HTML = r"""<!doctype html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>مدير ملفات المشروع</title>
  <style>
    body{font-family:Segoe UI,Tahoma,Arial; background:#0b1220; color:#e8eefc; margin:0}
    .wrap{max-width:980px; margin:24px auto; padding:0 16px}
    .card{background:#121b2f; border:1px solid #223055; border-radius:14px; padding:16px; margin-bottom:14px}
    h1{font-size:18px; margin:0 0 10px}
    h2{font-size:15px; margin:0 0 10px; color:#cfe0ff}
    input, textarea{width:100%; box-sizing:border-box; background:#0b1220; color:#e8eefc; border:1px solid #2b3b66; border-radius:10px; padding:10px; outline:none}
    textarea{min-height:220px; resize:vertical; font-family:Consolas, monospace}
    .row{display:flex; gap:10px; align-items:center}
    .row > * {flex:1}
    .btns{display:flex; gap:10px; flex-wrap:wrap; margin-top:10px}
    button{background:#2b68ff; color:white; border:0; border-radius:10px; padding:10px 14px; cursor:pointer}
    button.secondary{background:#2a375f}
    button.danger{background:#b63737}
    button:disabled{opacity:.5; cursor:not-allowed}
    .muted{color:#a9b7d9; font-size:13px}
    .status{margin-top:8px; padding:10px; border-radius:10px; border:1px solid #2b3b66; background:#0b1220}
    .ok{border-color:#1f8a50}
    .bad{border-color:#b63737}
    .warn{border-color:#c38a1d}
    code{background:#0b1220; padding:2px 6px; border-radius:8px; border:1px solid #2b3b66}
  </style>
</head>
<body>
<div class="wrap">
  <div class="card">
    <h1>أداة ويب محلية لإدارة الملفات داخل مشروع ثابت المسار</h1>
    <div class="muted">Base: <code id="base"></code></div>
  </div>

  <div class="card">
    <h2>الخطوة الأولى: إدخال المسار النسبي</h2>
    <div class="row">
      <input id="rel" placeholder="مثال: src/app/admin/(dashboard)/inbox/page.tsx">
      <button class="secondary" id="paste">📋 لصق</button>
      <button id="confirm">تأكيد المسار</button>
    </div>
    <div id="step1Status" class="status warn">اكتب مسارًا نسبيًا ثم اضغط تأكيد.</div>
  </div>

  <div class="card" id="step2Card">
    <h2>الخطوة الثانية: التعامل مع الملف</h2>
    <div class="muted">Target: <code id="target">-</code></div>
    <div id="fileStatus" class="status warn">لم يتم تأكيد المسار بعد.</div>

    <div class="btns">
      <button class="secondary" id="refresh" disabled>🔄 تحديث الحالة</button>
      <button id="create" disabled>➕ إنشاء الملف</button>
      <button class="danger" id="write" disabled>✍️ كتابة النص في الملف</button>
    </div>

    <div style="margin-top:12px" class="muted">النص الذي سيتم كتابته داخل الملف (سيتم الاستبدال بالكامل):</div>
    <textarea id="content" placeholder="اكتب هنا..."></textarea>
  </div>
</div>

<script>
const $ = (id)=>document.getElementById(id);

function setStep2Enabled(on){
  $("refresh").disabled = !on;
  $("create").disabled = !on;
  $("write").disabled = !on;
  $("content").disabled = !on;
}

function box(el, cls, text){
  el.className = "status " + cls;
  el.textContent = text;
}

async function api(path, payload){
  const res = await fetch(path, {
    method:"POST",
    headers: {"Content-Type":"application/json"},
    body: JSON.stringify(payload||{})
  });
  const data = await res.json();
  if(!res.ok) throw new Error(data && data.error ? data.error : ("HTTP " + res.status));
  return data;
}

async function loadMeta(){
  const res = await fetch("/api/meta");
  const data = await res.json();
  $("base").textContent = data.base_dir;
}

let current = { rel:"", full:"" };

$("paste").onclick = async ()=>{
  try{
    const t = await navigator.clipboard.readText();
    if(!t.trim()) return;
    $("rel").value = t.trim();
  }catch(e){
    alert("المتصفح منع الوصول للـ Clipboard. جرّب Ctrl+V داخل الحقل.");
  }
};

$("confirm").onclick = async ()=>{
  const rel = $("rel").value;
  try{
    const data = await api("/api/confirm", {relative_path: rel});
    current.rel = data.relative_path;
    current.full = data.full_path;
    $("target").textContent = data.full_path;
    box($("step1Status"), "ok", "تم تأكيد المسار بنجاح.");
    setStep2Enabled(true);
    await refresh();
  }catch(e){
    current = {rel:"", full:""};
    $("target").textContent = "-";
    setStep2Enabled(false);
    box($("step1Status"), "bad", e.message);
    box($("fileStatus"), "warn", "لم يتم تأكيد المسار بعد.");
  }
};

async function refresh(){
  if(!current.full) return;
  try{
    const data = await api("/api/status", {full_path: current.full});
    if(data.type === "file"){
      box($("fileStatus"), "ok", "✔ الملف موجود");
      $("create").disabled = true;
    }else if(data.type === "dir"){
      box($("fileStatus"), "bad", "يوجد مجلد بنفس اسم الملف (غير صالح).");
      $("create").disabled = true;
    }else{
      box($("fileStatus"), "bad", "❌ الملف غير موجود");
      $("create").disabled = false;
    }
  }catch(e){
    box($("fileStatus"), "bad", e.message);
  }
}

$("refresh").onclick = refresh;

$("create").onclick = async ()=>{
  if(!current.full) return;
  if(!confirm("سيتم إنشاء المجلدات الناقصة ثم إنشاء ملف فارغ.\nهل تريد المتابعة؟")) return;
  try{
    const data = await api("/api/create", {full_path: current.full});
    alert(data.message);
    await refresh();
  }catch(e){
    alert(e.message);
  }
};

$("write").onclick = async ()=>{
  if(!current.full) return;
  if(!confirm("سيتم استبدال محتوى الملف بالكامل بالنص الحالي.\nهل تريد المتابعة؟")) return;
  try{
    const content = $("content").value;
    const data = await api("/api/write", {full_path: current.full, content});
    alert(data.message);
    await refresh();
  }catch(e){
    alert(e.message);
  }
};

loadMeta();
setStep2Enabled(false);
</script>
</body>
</html>
"""


class Handler(BaseHTTPRequestHandler):
    server_version = "LocalFileManager/1.0"

    def _send(self, status: int, content_type: str, body: bytes):
        self.send_response(status)
        self.send_header("Content-Type", content_type)
        self.send_header("Content-Length", str(len(body)))
        self.send_header("Cache-Control", "no-store")
        self.end_headers()
        self.wfile.write(body)

    def _json(self, status: int, obj: dict):
        body = json.dumps(obj, ensure_ascii=False).encode("utf-8")
        self._send(status, "application/json; charset=utf-8", body)

    def do_GET(self):
        if self.path == "/" or self.path.startswith("/?"):
            self._send(HTTPStatus.OK, "text/html; charset=utf-8", INDEX_HTML.encode("utf-8"))
            return
        if self.path == "/api/meta":
            self._json(HTTPStatus.OK, {"base_dir": os.path.abspath(BASE_DIR)})
            return

        self._json(HTTPStatus.NOT_FOUND, {"error": "Not found"})

    def do_POST(self):
        length = int(self.headers.get("Content-Length", "0") or "0")
        raw = self.rfile.read(length) if length > 0 else b"{}"
        try:
            data = json.loads(raw.decode("utf-8") or "{}")
        except json.JSONDecodeError:
            self._json(HTTPStatus.BAD_REQUEST, {"error": "Invalid JSON"})
            return

        if self.path == "/api/confirm":
            rel_raw = str(data.get("relative_path", ""))
            rel = normalize_relative(rel_raw)
            ok, msg, full = validate_relative_path(BASE_DIR, rel)
            if not ok:
                self._json(HTTPStatus.BAD_REQUEST, {"error": msg})
                return
            self._json(HTTPStatus.OK, {"message": msg, "relative_path": rel, "full_path": full})
            return

        if self.path == "/api/status":
            full = str(data.get("full_path", ""))
            # Security: ensure this full path is inside base
            base = os.path.abspath(BASE_DIR)
            full_abs = os.path.abspath(full)
            try:
                if os.path.commonpath([base, full_abs]) != base:
                    self._json(HTTPStatus.FORBIDDEN, {"error": "Forbidden path"})
                    return
            except ValueError:
                self._json(HTTPStatus.FORBIDDEN, {"error": "Forbidden path"})
                return

            st = file_status(full_abs)
            self._json(HTTPStatus.OK, st)
            return

        if self.path == "/api/create":
            full = str(data.get("full_path", ""))
            base = os.path.abspath(BASE_DIR)
            full_abs = os.path.abspath(full)

            try:
                if os.path.commonpath([base, full_abs]) != base:
                    self._json(HTTPStatus.FORBIDDEN, {"error": "Forbidden path"})
                    return
            except ValueError:
                self._json(HTTPStatus.FORBIDDEN, {"error": "Forbidden path"})
                return

            if os.path.exists(full_abs):
                if os.path.isdir(full_abs):
                    self._json(HTTPStatus.BAD_REQUEST, {"error": "يوجد مجلد بنفس اسم الملف المطلوب."})
                    return
                self._json(HTTPStatus.OK, {"message": "الملف موجود بالفعل."})
                return

            try:
                parent = os.path.dirname(full_abs)
                if parent:
                    os.makedirs(parent, exist_ok=True)
                with open(full_abs, "x", encoding="utf-8"):
                    pass
            except OSError as e:
                self._json(HTTPStatus.INTERNAL_SERVER_ERROR, {"error": f"فشل إنشاء الملف: {e}"})
                return

            self._json(HTTPStatus.OK, {"message": "تم إنشاء الملف بنجاح."})
            return

        if self.path == "/api/write":
            full = str(data.get("full_path", ""))
            content = data.get("content", "")
            if not isinstance(content, str):
                self._json(HTTPStatus.BAD_REQUEST, {"error": "content must be a string"})
                return

            base = os.path.abspath(BASE_DIR)
            full_abs = os.path.abspath(full)

            try:
                if os.path.commonpath([base, full_abs]) != base:
                    self._json(HTTPStatus.FORBIDDEN, {"error": "Forbidden path"})
                    return
            except ValueError:
                self._json(HTTPStatus.FORBIDDEN, {"error": "Forbidden path"})
                return

            if not os.path.isfile(full_abs):
                self._json(HTTPStatus.BAD_REQUEST, {"error": "الملف غير موجود. أنشئه أولًا."})
                return

            try:
                with open(full_abs, "w", encoding="utf-8", newline="") as f:
                    f.write(content)
            except OSError as e:
                self._json(HTTPStatus.INTERNAL_SERVER_ERROR, {"error": f"فشل كتابة الملف: {e}"})
                return

            self._json(HTTPStatus.OK, {"message": "تمت كتابة النص داخل الملف بنجاح."})
            return

        self._json(HTTPStatus.NOT_FOUND, {"error": "Not found"})

    def log_message(self, fmt, *args):
        # Reduce console noise; comment next line to enable logs
        return


def open_browser():
    url = f"http://{HOST}:{PORT}/"
    try:
        webbrowser.open(url, new=1)
    except Exception:
        pass


def main():
    base_abs = os.path.abspath(BASE_DIR)
    if not os.path.isdir(base_abs):
        # لا ننشئ المسار تلقائيًا — فقط تحذير
        print("WARNING: BASE_DIR does not exist:", base_abs)

    server = ThreadingHTTPServer((HOST, PORT), Handler)
    threading.Timer(0.4, open_browser).start()
    print(f"Serving on {HOST}:{PORT}")
    server.serve_forever()


if __name__ == "__main__":
    main()