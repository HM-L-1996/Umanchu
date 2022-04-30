import time

from bs4 import BeautifulSoup
from html_table_parser import parser_functions
import pandas as pd
import requests
import boto3
from datetime import datetime
from pytz import timezone
import re

# 서울 시 내의 지하철 역 목록 크롤링
def s3_station():
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

# 지하철역 목록 s3 업로드 (5개씩 업로드)
def s3_station_upload(station_list,section):
    ACCESS_KEY = ''
    SECRET_KEY = ''
    bucket = ''
    s3 = boto3.client('s3', aws_access_key_id=ACCESS_KEY, aws_secret_access_key=SECRET_KEY)
    text=""
    cnt=1
    date_time = datetime.now(timezone('Asia/Seoul')).strftime('%Y-%m-%d')
    for station in station_list:
        if cnt%5==0:
            text = text + station
            print(cnt//5,text)
            text = text.encode("utf-8")
            s3.put_object(Body=text,
                          Bucket=bucket,
                          Key='{}/{}.txt'.format(
                              date_time,
                              section
                          )
                          )
            time.sleep(10)
            s3.delete_object(Bucket=bucket,
                             Key='{}/{}.txt'.format(
                                 date_time,
                                 section
                             ))
            text=""

        else:
            text = text + station + " "
        cnt+=1
    else:
        if text!="":
            print(cnt//5+1,text)
            text=text[:-1]
            text = text.encode("utf-8")
            time.sleep(5)
            s3.put_object(Body=text,
                          Bucket=bucket,
                          Key='{}/{}.txt'.format(
                              date_time,
                              section
                          )
                          )
            time.sleep(10)
            s3.delete_object(Bucket=bucket,
                             Key='{}/{}.txt'.format(
                                 date_time,
                                 section
                             ))
#s3_station_upload(s3_station(),'food')