import os
import csv
import json

def make_json(csvFilePath):

    data = {}

    with open(csvFilePath, encoding='utf-8') as csvf:
        csvReader = csv.DictReader(csvf)

        for rows in csvReader:
            key = rows['Name'].lower()
            key = key.replace(" ", "-")
            data[key] = rows

    return data;


def safe_string(string):
    string = string.replace("\"", "\\\"")
    return string


mvmt_details = make_json('../assets/mvmt_details.csv')

os.remove('../assets/mvmt_details.json')
f = open('../assets/mvmt_details.json', "a", encoding="utf-8")

f.write('{\n')

for mvmt in mvmt_details:
    f.write('\"'+ mvmt + '\": {\n')

    for fieldname in mvmt_details.get(mvmt).keys():
        f.write('    \"'+ fieldname +'\": \"'+safe_string(mvmt_details.get(mvmt).get(fieldname))+'\",\n')

    f.write('    },\n')

f.write('}');
f.close()


# WHERE THE MAGIC HAPPENS ======================================================
