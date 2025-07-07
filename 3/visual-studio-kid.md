Tô fazendo um "Visual Studio Code", Quero Aprimorar isto:

---

### Visual Studio Kid

```python

import tkinter as tekinte
from tkinter import ttk, filedialog, messagebox, font


class TextEditor:
    def __init__(self, root):
        self.root = root
        self.root.title("Visual Studio Kid")
        self.root.geometry("800x600")
        self.text_area = tekinte.Text()


        self.notebook = ttk.Notebook(self.root)
        self.notebook.pack(fill="both", expand=True)

        # Adiciona aba inicial
        self.abaNova("novo arquivo")

        # Menu Superior
        self.the_menus = tekinte.Menu(self.root)
        self.root.config(menu=self.the_menus)

        # Menu Arquivo
        self.menu_arquivo = tekinte.Menu(self.the_menus, tearoff=0)
        self.the_menus.add_cascade(label="Arquivo", menu=self.menu_arquivo)
        self.menu_arquivo.add_command(label="Novo   (ctrl+T)", command=lambda: self.abaNova("Sem Título"))
        self.menu_arquivo.add_command(label="Abrir   (ctrl+A)", command=self.open_file)
        self.menu_arquivo.add_command(label="Salvar   (ctrl+S)", command=self.save_file)
        self.menu_arquivo.add_separator()
        self.menu_arquivo.add_command(label="Sair   (alt+f4)", command=self.root.quit)

        # Menu Formatar
        self.menu_formatar = tekinte.Menu(self.the_menus, tearoff=0)
        self.the_menus.add_cascade(label="Formatar", menu=self.menu_formatar)
        self.menu_formatar.add_command(label="Fonte", command=self.change_font)
        self.menu_formatar.add_command(label="Alternar Tema", command=self.mudar_tema)
        self.menu_formatar.add_command(label="Buscar/Substituir", command=lambda: Janela_procuraMuda(self.root, self.text_area))

        # Atalhos de teclado
        self.setup_shortcuts()



    # ---------------------------------------- All my Methods (no 2o. committ) -------------
    def setup_shortcuts(self):
        self.root.bind("<Control-s>", lambda event: self.save_file())
        self.root.bind("<Control-a>", lambda event: self.open_file())
        self.root.bind("<Control-n>", lambda event: self.abaNova("novo ficheiro"))
        self.root.bind("<Control-t>", lambda event: self.abaNova("sem titulo"))

    def setup_theme(self):
        self.style = ttk.Style(self.root)
        self.style.theme_use("clam")  # Tema inicial (pode ser 'alt', 'default', etc.)

    def mudar_tema(self):
        current_theme = self.style.theme_use()
        if current_theme == "clam":
            self.style.theme_use("alt")  # Tema mais escuro
            self.text_area.config(bg="#333333", fg="white", insertbackground="white")
        else:
            self.style.theme_use("clam")  # Tema claro
            self.text_area.config(bg="white", fg="black", insertbackground="black")

#  ------
    def abaNova(self, title):
        frame = ttk.Frame(self.notebook)
        self.notebook.add(frame, text=title)

        # Área de texto e scrollbar
        text_area = tekinte.Text(frame, wrap="word", undo=True)
        scrollbar = ttk.Scrollbar(frame, command=text_area.yview)
        text_area.configure(yscrollcommand=scrollbar.set)

        text_area.pack(side="left", fill="both", expand=True)
        scrollbar.pack(side="right", fill="y")

        # Atualiza a referência para a aba atual
        self.notebook.select(frame)
        return text_area

    def get_current_tab(self):
        current_tab = self.notebook.select()
        return self.notebook.index(current_tab)

    def get_current_text_widget(self):
        tab_id = self.get_current_tab()
        frame = self.notebook.winfo_children()[tab_id]
        return frame.winfo_children()[0]  # Assume que o Text é o primeiro filho

    def open_file(self):
        file_path = filedialog.askopenfilename(filetypes=[("Arquivos de Texto", "*.txt")])
        if file_path:
            text_widget = self.get_current_text_widget()
            with open(file_path, "r") as file:
                text_widget.delete("1.0", tekinte.END)
                text_widget.insert("1.0", file.read())
            self.notebook.tab(self.get_current_tab(), text=file_path.split("/")[-1])

    def save_file(self):
        text_widget = self.get_current_text_widget()
        file_path = filedialog.asksaveasfilename(defaultextension=".txt")
        if file_path:
            with open(file_path, "w") as file:
                file.write(text_widget.get("1.0", tekinte.END))
            self.notebook.tab(self.get_current_tab(), text=file_path.split("/")[-1])
#  ------

    # ---------------------------------------- All my Methods -------------

    # def new_file(self):
    #     self.text_area.delete(1.0, tekinte.END)

    def open_file(self):
        file_path = filedialog.askopenfilename(filetypes=[("Arquivos de Texto", "*.txt"), ("Todos os arquivos", "*.*")])
        if file_path:
            with open(file_path, "r") as file:
                self.text_area.delete(1.0, tekinte.END)
                self.text_area.insert(1.0, file.read())

    def save_file(self):
        file_path = filedialog.asksaveasfilename(defaultextension=".txt", filetypes=[("Arquivos de Texto", "*.txt")])
        if file_path:
            with open(file_path, "w") as file:
                file.write(self.text_area.get(1.0, tekinte.END))
            messagebox.showinfo("Sucesso", "Arquivo salvo!")

    def change_font(self):
        font_window = tekinte.Toplevel(self.root)
        font_window.geometry("280x400")
        tekinte.Label(font_window, text="Escolha a fonte:").pack()
        font_family = tekinte.StringVar(value="Arial")
        tekinte.OptionMenu(font_window, font_family, "Arial", "Times New Roman", "Courier New", "Consolas", "Candara").pack()
        tekinte.Button(font_window, text="Aplicar", command=lambda: self.apply_font(font_family.get())).pack()

    def apply_font(self, font_name):
        new_font = font.Font(family=font_name, size=12)
        self.text_area.configure(font=new_font)

    def setup_shortcuts(self):
        self.root.bind("<Control-s>", lambda event: self.save_file())
        self.root.bind("<Control-a>", lambda event: self.open_file())
        self.root.bind("<Control-n>", lambda event: self.abaNova("novo ficheiro"))
        self.root.bind("<Control-t>", lambda event: self.abaNova("sem titulo"))


class Janela_procuraMuda:
    def __init__(self, root, text_widget):
        self.root = root
        self.text = text_widget
        self.top = tekinte.Toplevel(root)
        self.top.title("Buscar/Substituir")

        # Entradas
        tekinte.Label(self.top, text="Buscar:").grid(row=0, column=0, padx=5, pady=5)
        self.search_entry = tekinte.Entry(self.top, width=30)
        self.search_entry.grid(row=0, column=1, padx=5, pady=5)

        tekinte.Label(self.top, text="Substituir por:").grid(row=1, column=0, padx=5, pady=5)
        self.replace_entry = tekinte.Entry(self.top, width=30)
        self.replace_entry.grid(row=1, column=1, padx=5, pady=5)

        # Botões
        tekinte.Button(self.top, text="Buscar Próximo", command=self.find_next).grid(row=2, column=0, padx=5, pady=5)
        tekinte.Button(self.top, text="Substituir", command=self.replace).grid(row=2, column=1, padx=5, pady=5)
        tekinte.Button(self.top, text="Substituir Todos", command=self.replace_all).grid(row=3, column=0, columnspan=2, pady=5)

        # Variável para controle da posição da busca
        self.last_pos = "1.0"

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
    app = TextEditor(root)
    root.mainloop()

```

---

Mas antes, Quero resolver os obvios problemas. Ajudas me?
