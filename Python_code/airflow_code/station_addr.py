from bs4 import BeautifulSoup
from html_table_parser import parser_functions
import requests
import re
import googlemaps
import pandas as pd
import warnings
import pymysql

def station_crawling():
    link = 'https://ko.wikipedia.org/wiki/수도권_전철역_목록'
    headers = {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/97.0.4692.99 Safari/537.36'}
    req = requests.get(link, headers=headers)
    soup = BeautifulSoup(req.text,'html.parser')
    data = soup.find_all('table',{'class':'wikitable'})
    station_list=[]
    for i in range(len(data)):
        table = parser_functions.make2d(data[i])
        df = pd.DataFrame(data=table[1:],columns=table[0])
        dfresult = df[df['소재지'].str.contains("서울특별시",na=False,case=False)]
        station_list.append(dfresult)
    station_df=pd.concat(station_list,ignore_index=True)
    regex = "\(.*\)|\s-\s.*"
    tmp = station_df['철도역'].tolist()
    station_return = [re.sub(regex, '', s) + "역" for s in tmp]
    station_return = list(set(station_return))
    station_return = sorted(station_return)
    return station_return
def station_addr():
    warnings.filterwarnings(action='ignore')
    host = ''
    port = 3306
    username = ''
    database = ''
    password = ''
    conn = pymysql.connect(host=host, user=username, passwd=password, db=database, port=port, charset='utf8mb4',
                           cursorclass=pymysql.cursors.DictCursor)
    cursor = conn.cursor()
    drop_sql = """
            drop table if exists station_info;
            """
    cursor.execute(drop_sql)

    sql = """
        create table if not exists station_info(
            station_id int not null auto_increment,
            station_name varchar(30),
            lat	double,
            lng	double,
            primary key(station_id)
        );
        """
    cursor.execute(sql)
    gmaps_key=""
    gmaps = googlemaps.Client(key=gmaps_key)
    stations = station_crawling()
    df=pd.DataFrame()
    for station in stations:
        if station == "동대문역":
            df = df.append({
                "station": station,
                "lat": 37.57206399746385,
                "lng": 127.01173162139469,
            }, ignore_index=True)
            continue
        station_geocode = gmaps.geocode(station, language='ko')
        try:
            loc = station_geocode[0].get("geometry")

            loc_dic = loc['location']
            df = df.append({
                        "station":station,
                        "lat":loc_dic['lat'],
                        "lng":loc_dic['lng'],
                       },ignore_index=True)
        except:
            df = df.append({"station": station,
                       "lat": None,
                       "lng": None,
                       }, ignore_index=True)
    for index, row in df.iterrows():
        sql = "insert into station_info (station_name,lat,lng) values({},{},{})".format("'" + row['station'] + "'",float(row['lat']),float(row['lng']))
        cursor.execute(sql)
    conn.commit()
