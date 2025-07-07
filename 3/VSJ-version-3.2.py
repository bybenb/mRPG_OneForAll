'''

versao 3.2

# Wklv Surjudp zdv pdgh eb 'Ehqb Uhlv LL' (@ebehqe ru @endsd8)
# Gdwd: ghcdvvhlv gh Mxqkr gh 2n25
# (F) 2n25 PlvvdrUSJ. Doo Uljkwv Uhvhuyhg 'Ehqb Uhlv LL'

'''

import tkinter as tekinte
from tkinter import ttk, filedialog, messagebox, font
import keyword


class VSJunior:
    def __init__(self, root):
        self.tabs = {}  # Dicionário: título -> frame
        self.root = root
        self.root.title("Visual Studio Kid")
        self.root.geometry("800x600")

        self.setup_theme()
        self.notebook = ttk.Notebook(self.root)
        self.notebook.pack(fill="both", expand=True)

        self.status_bar = tekinte.Label(self.root, text="Linha: 1 | Coluna: 0\t\t\t\t\t\t\t\t\t© 2025 MissaoRPG. All Rights Reserved 'Beny Reis II'", anchor="w")
        self.status_bar.pack(fill="x", side="bottom")

        self.abaNova("novo arquivo")

        # Menu Arquivo
        self.the_menus = tekinte.Menu(self.root)
        self.root.config(menu=self.the_menus)
        
        self.menu_arquivo = tekinte.Menu(self.the_menus, tearoff=0)
        self.the_menus.add_cascade(label="Arquivo", menu=self.menu_arquivo)
        self.menu_arquivo.add_command(label="Novo   (Ctrl+T)", command=lambda: self.abaNova("Sem Título"))
        self.menu_arquivo.add_command(label="Abrir   (Ctrl+O)", command=self.abrir_ficheiro)
        self.menu_arquivo.add_command(label="Salvar   (Ctrl+S)", command=self.slavar_ficheiro)
        self.menu_arquivo.add_separator()
        self.menu_arquivo.add_command(label="Sair   (Alt+F4)", command=self.root.quit)

        # Menu Formatar
        self.menu_formatar = tekinte.Menu(self.the_menus, tearoff=0)
        self.the_menus.add_cascade(label="Formatar", menu=self.menu_formatar)
        self.menu_formatar.add_command(label="Fonte", command=self.mudar_fonte)
        self.menu_formatar.add_command(label="Alternar Tema", command=self.mudar_tema)
        self.menu_formatar.add_command(
            label="Buscar/Substituir", 
            command=self.abrirJanela_procuraMuda
            )

        self.setup_shortcuts()


    def abrirJanela_procuraMuda(self):
        Janela_procuraMuda(self.root, self.get_current_text_widget())

    def setup_theme(self):
        self.style = ttk.Style(self.root)
        self.style.theme_use("clam")


    def mudar_tema(self):
        current_theme = self.style.theme_use()
        text_widget = self.get_current_text_widget()

        if current_theme == "clam":
            self.style.theme_use("alt")
            text_widget.config(bg="#333333", fg="white", insertbackground="white")
        else:
            self.style.theme_use("clam")
            text_widget.config(bg="white", fg="black", insertbackground="black")


    def abaNova(self, title):
        frame = ttk.Frame(self.notebook)
        tab_title = f"{title}   ❌"
        self.notebook.add(frame, text=tab_title)
        self.tabs[tab_title] = frame

        text_area = tekinte.Text(frame, wrap="word", undo=True)
        text_area.pack(side="left", fill="both", expand=True)

        scrollbar = ttk.Scrollbar(frame, command=text_area.yview)
        text_area.configure(yscrollcommand=scrollbar.set)
        scrollbar.pack(side="right", fill="y")

        text_area.tag_configure("keyword", foreground="blue")
        text_area.bind("<KeyRelease>", lambda e: self.highlight_syntax(text_area))
        text_area.bind("<KeyRelease>", lambda e: self.update_status(text_area), add=True)
        text_area.bind("<ButtonRelease>", lambda e: self.update_status(text_area))

        self.notebook.select(frame)

        # Detectar clique para fechar aba
        self.notebook.bind("<Button-1>", self.handle_tab_click)

        return text_area


    def handle_tab_click(self, event):
        x, y = event.x, event.y
        element = self.notebook.identify(x, y)
        if "label" in element:
            index = self.notebook.index(f"@{x},{y}")
            tab_text = self.notebook.tab(index, "text")
            if tab_text.endswith("❌") and self.notebook.bbox(index)[2] - x < 25:
                self.notebook.forget(index)


    def get_current_tab(self):
        current_tab = self.notebook.select()
        return self.notebook.index(current_tab)


    def get_current_text_widget(self):
        tab_id = self.get_current_tab()
        frame = self.notebook.winfo_children()[tab_id]
        return frame.winfo_children()[0]


    def abrir_ficheiro(self):
        file_path = filedialog.askopenfilename(filetypes=[("Arquivos de Texto", "*.txt"), ("Todos os arquivos", "*.*")])
        if file_path:
            text_widget = self.get_current_text_widget()
            with open(file_path, "r") as file:
                text_widget.delete("1.0", tekinte.END)
                text_widget.insert("1.0", file.read())
            self.highlight_syntax(text_widget)
            self.notebook.tab(self.get_current_tab(), text=file_path.split("/")[-1])


    def slavar_ficheiro(self):
        text_widget = self.get_current_text_widget()
        file_path = filedialog.asksaveasfilename(defaultextension=".txt", filetypes=[("Arquivos de Texto", "*.txt")])
        if file_path:
            with open(file_path, "w") as file:
                file.write(text_widget.get("1.0", tekinte.END))
            self.notebook.tab(self.get_current_tab(), text=file_path.split("/")[-1])
            messagebox.showinfo("Sucesso", "Arquivo salvo!")


    def mudar_fonte(self):
        font_window = tekinte.Toplevel(self.root)
        font_window.geometry("280x400")
        tekinte.Label(font_window, text="Escolha a fonte:").pack(pady=10)

        font_family = tekinte.StringVar(value="Arial")
        tekinte.OptionMenu(font_window, font_family, "Arial", "Times New Roman", "Courier New", "Consolas", "Candara").pack()

        tekinte.Button(font_window, text="Aplicar", command=lambda: self.apply_font(font_family.get())).pack(pady=10)


    def apply_font(self, font_name):
        new_font = font.Font(family=font_name, size=12)
        self.get_current_text_widget().configure(font=new_font)


    def setup_shortcuts(self):
        self.root.bind("<Control-s>", lambda event: self.slavar_ficheiro())
        self.root.bind("<Control-o>", lambda event: self.abrir_ficheiro())
        self.root.bind("<Control-n>", lambda event: self.abaNova("Novo Ficheiro"))
        self.root.bind("<Control-t>", lambda event: self.abaNova("Sem Título"))
        self.root.bind("<Control-f>", lambda event: self.abrirJanela_procuraMuda())

    def highlight_syntax(self, text_widget):
        content = text_widget.get("1.0", tekinte.END)
        text_widget.tag_remove("keyword", "1.0", tekinte.END)

        for kw in keyword.kwlist:
            start = "1.0"
            while True:
                pos = text_widget.search(rf"\m{kw}\M", start, stopindex=tekinte.END, regexp=True)
                if not pos:
                    break
                end = f"{pos}+{len(kw)}c"
                text_widget.tag_add("keyword", pos, end)
                start = end


    def update_status(self, text_widget):
        index = text_widget.index(tekinte.INSERT)
        linha, coluna = index.split(".")
        self.status_bar.config(text=f"Linha: {linha} | Coluna: {coluna}\t\t\t\t\t\t\t\t\t© 2025 MissaoRPG. All Rights Reserved Beny Reis II")


class Janela_procuraMuda:
    def __init__(self, root, text_widget):
        self.root = root
        self.text = text_widget
        self.top = tekinte.Toplevel(root)
        self.top.title("Buscar/Substituir")

        tekinte.Label(self.top, text="Buscar:").grid(row=0, column=0, padx=5, pady=5)
        self.search_entry = tekinte.Entry(self.top, width=30)
        self.search_entry.grid(row=0, column=1, padx=5, pady=5)

        tekinte.Label(self.top, text="Substituir por:").grid(row=1, column=0, padx=5, pady=5)
        self.replace_entry = tekinte.Entry(self.top, width=30)
        self.replace_entry.grid(row=1, column=1, padx=5, pady=5)

        # tekinte.Button(self.top, text="Buscar Próximo", command=self.find_next).grid(row=2, column=0, padx=5, pady=5)         
        # tekinte.Button(self.top, text="Substituir", command=self.replace).grid(row=2, column=1, padx=5, pady=5)
        tekinte.Button(self.top, text="Substituir Todos", command=self.replace_all).grid(row=3, column=0, columnspan=2, pady=5)

        self.last_pos = "1.0"
        self.search_entry.focus()

    def find_next(self):
        term = self.search_entry.get()
        if term:
            pos = self.text.search(term, self.last_pos, stopindex=tekinte.END)
            if pos:
                start = pos
                end = f"{pos}+{len(term)}c"
                self.text.tag_remove("sel", "1.0", tekinte.END)
                self.text.tag_add("sel", start, end)
                self.text.mark_set("insert", pos)
                self.text.see(pos)
                self.last_pos = end

    def replace(self):
        term = self.search_entry.get()
        replacement = self.replace_entry.get()
        if term and replacement:
            if self.text.tag_ranges("sel"):
                self.text.delete("sel.first", "sel.last")
                self.text.insert("sel.first", replacement)
            self.find_next()

    def replace_all(self):
        term = self.search_entry.get()
        replacement = self.replace_entry.get()
        if term and replacement:
            content = self.text.get("1.0", tekinte.END)
            new_content = content.replace(term, replacement)
            self.text.delete("1.0", tekinte.END)
            self.text.insert("1.0", new_content)


if __name__ == "__main__":
    root = tekinte.Tk()
    app = VSJunior(root)
    root.mainloop()
