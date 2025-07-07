"""
Haha, isso não nada um virus (^_^)
simplesmente fiz uma frase que roda 1000x
"""


from time import sleep
wisha, be = 1, True

while be:
	print(f"{wisha}Qnd. Isso eh o VS Kid (^_^)")
	wisha += 1 
	sleep(0.2) if wisha % 99 == 0 else print("")

	be = True if wisha < 1001 else False
input("Toca na Letra B: ")
