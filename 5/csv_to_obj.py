import csv
from operator import itemgetter  # sorts results list to print the results

def unicode_csv_reader(utf8_data, dialect=csv.excel, **kwargs):
    csv_reader = csv.reader(utf8_data, dialect=dialect, **kwargs)
    for row in csv_reader:
        yield [unicode(cell, 'utf-8') for cell in row]

def open_movements_csv_convert_to_db():
    """ Create movements data from csv."""
    file_title = 'Art_Translate_Art_Movements_10_21_20.csv'
    file_folder = ''
    file_subject = file_folder+file_title
    myfile = open(file_subject,'rt', encoding='utf-8') # or "ascii" , "utf8"
    movements_data = csv.reader(myfile)
    return movements_data

def convert_csv_to_text_objects():

    movements_database = open_movements_csv_convert_to_db()

    for data_field in movements_database:
        print ()
        print ("{ ")
        print ("  name: \""+         data_field[0]+                                                      "\",")
        print ("  dates: \""+        data_field[9], data_field[10], "-", data_field[11], data_field[12]+ "\",")
        print ("  style: \""+        data_field[3]+                                                      "\",")
        print ("  commentary: \""+   data_field[18]+                                                     "\",")
        print ("  themes: \""+       data_field[5]+                                                      "\",")
        print ("  start_reason: \""+ data_field[6]+                                                      "\",")
        print ("  end_reason: \""+   data_field[7]+                                                      "\",")
        print ("}, ")

    return

convert_csv_to_text_objects()
