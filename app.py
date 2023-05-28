from flask import Flask, render_template
import subprocess
import requests
import json

process = subprocess.Popen(["python3", "gmeteo-parser.py"])

def get_air_quality():
	url = 'https://www.airnowapi.org/aq/observation/zipCode/current/'
	parameters = {
		'format': 'application/json',
		'zipCode': '10002',  # Почтовый индекс местоположения, о котором вы хотите получить данные
		'distance': 25,  # Расстояние в милях для поиска измерений вокруг указанного почтового индекса
		'API_KEY': "775F5E76-39FA-4D35-9102-F7E36FE78036",
	}

	response = requests.get(url, params=parameters)
	
	return response.text
	pass

app = Flask(__name__)

@app.route('/')
def index():
	return render_template('index.html')

@app.route('/aq')
def aq():
	return get_air_quality()

if __name__ == '__main__':
	app.run(port=5010)
