import schedule
import time
import subprocess
from bs4 import BeautifulSoup
import os

def execute_wget(url, output_file):
	command = ['wget', url, '-O', output_file]
	# Выполнение команды wget
	process = subprocess.Popen(command, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
	
	# Ожидание завершения процесса
	stdout, stderr = process.communicate()
	process.wait()
	
def parse_and_save():
	print("Refresh meteo.html")
	# Загрузка HTML-страницы
	url = 'https://www.gismeteo.ua/weather-zhytomyr-4943/now/'
	execute_wget(url, "./raw_page.html")

	with open("raw_page.html", "r") as file:
		html = str(file.read())

	os.remove("raw_page.html")

	# Парсинг блока .section-bottom-shadow
	soup = BeautifulSoup(html, 'html.parser')
	section_bottom_shadow = soup.select_one('.section-bottom-shadow')

	# Создание файла и сохранение результата
	with open('static/meteo.html', 'w') as file:
		file.write(str(section_bottom_shadow))

# Запуск парсинга раз в час
schedule.every().hour.do(parse_and_save)
parse_and_save()

while True:
	schedule.run_pending()
	time.sleep(1)
