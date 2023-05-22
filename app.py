from flask import Flask, render_template
import subprocess

process = subprocess.Popen(["python3", "gismeteo-parser.py"])

app = Flask(__name__)

@app.route('/')
def index():
	return render_template('index.html')

if __name__ == '__main__':
	app.run(port=5010)
