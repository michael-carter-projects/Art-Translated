import os
import csv
import json

def make_json(csvFilePath):

    data = {}

    with open(csvFilePath, encoding='utf-8') as csvf:
        csvReader = csv.DictReader(csvf)

        for rows in csvReader:
            key = rows['Name'].lower()
            key = key.replace(" ", "_")
            key = key.replace("-", "_")
            key = key.replace("/", "_")
            data[key] = rows

    return data;

def safe_field_name(string):
    string = string.lower()
    string = string.replace(" ", "_")
    return string

def safe_string(string):
    string = string.replace("\"", "\\\"")
    return string


mvmt_details = make_json('../assets/mvmt_details.csv')

os.remove('../assets/mvmt_details.js')
f = open('../assets/mvmt_details.js', "a", encoding="utf-8")

f.write('export const movement_details = {\n')

for mvmt in mvmt_details:
    f.write('    ' + mvmt + ': {\n')

    for fieldname in mvmt_details.get(mvmt).keys():
        f.write('        '+ safe_field_name(fieldname) +': \"'+safe_string(mvmt_details.get(mvmt).get(fieldname))+'\",\n')

    f.write('    },\n')

f.write('}');
f.close()


# WHERE THE MAGIC HAPPENS ======================================================
