#!/bin/bash
source ./venv/bin/activate
pip install -r requirements.txt
export FLASK_DEBUG=1
python3 -m flask --app api/index run -p 5328
