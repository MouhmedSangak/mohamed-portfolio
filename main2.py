import os
import tkinter as tk
from tkinter import ttk, messagebox

BASE_PATH = r"D:\My Progects at python\mohamed-portfolio"

def is_empty_file(path):
    try:
        return os.path.isfile(path) and os.path.getsize(path) == 0
    except:
        return False


def build_tree(folder, prefix=""):
    lines = []
    entries = sorted(os.listdir(folder))
    entries = [e for e in entries if not e.startswith(".")]

    for i, name in enumerate(entries):
        full = os.path.join(folder, name)
        last = i == len(entries) - 1
        connector = "└── " if last else "├── "

        if os.path.isdir(full):
            lines.append(prefix + connector + name + "/")
            ext = "    " if last else "│   "
            lines.extend(build_tree(full, prefix + ext))
        else:
            if is_empty_file(full):
                lines.append(prefix + connector + name + "  [فارغ]")
            else:
                lines.append(prefix + connector + name)

    return lines


def load_tree():
    text.config(state="normal")
    text.delete("1.0", tk.END)

    root_name = os.path.basename(BASE_PATH) + "/"
    text.insert(tk.END, root_name + "\n")

    for line in build_tree(BASE_PATH):
        text.insert(tk.END, line + "\n")

    text.config(state="disabled")


def copy_tree():
    content = text.get("1.0", tk.END)
    root.clipboard_clear()
    root.clipboard_append(content)
    root.update()
    messagebox.showinfo("تم", "تم نسخ الهيكل بنجاح 📋")


# ---------- GUI ----------
root = tk.Tk()
root.title("📂 Empty Files Viewer")
root.geometry("1000x600")

top = ttk.Frame(root, padding=10)
top.pack(fill="x")

ttk.Button(top, text="📋 نسخ", command=copy_tree).pack(side="left")

frame = ttk.Frame(root, padding=10)
frame.pack(fill="both", expand=True)

text = tk.Text(
    frame,
    font=("Consolas", 11),
    wrap="none"
)
text.pack(side="left", fill="both", expand=True)

scroll = ttk.Scrollbar(frame, command=text.yview)
scroll.pack(side="right", fill="y")
text.config(yscrollcommand=scroll.set)

load_tree()
root.mainloop()
