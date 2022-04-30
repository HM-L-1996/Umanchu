import boto3
import time
from datetime import datetime
from pytz import timezone
from s3_trigger import s3_station,s3_station_upload


def find_key(dict, val):
    return [key for key, value in dict.items() if value == val]

# 저장된 s3 데이터가 누락되어 있는지 확인하고 누락시 Lambda에 해당역 목록을 다시 크롤링하라는 이벤트 발생시키는 함수
def s3_dic(section):
    ACCESS_KEY = ''
    SECRET_KEY = ''
    bucket = ''
    s3 = boto3.client('s3', aws_access_key_id=ACCESS_KEY, aws_secret_access_key=SECRET_KEY)
    paginator = s3.get_paginator('list_objects_v2')
    date_time = datetime.now(timezone('Asia/Seoul')).strftime('%Y-%m-%d')
    pages = paginator.paginate(Bucket=bucket,Prefix=section+"/"+str(date_time)+"/")
    s3_list=dict()
    if section=="play":
        section_check=13
    else:
        section_check=10
    for page in pages:
        for object in page['Contents']:
            direcoryName = object['Key'].split('/')
            if direcoryName[0] == section:
                try:
                    s3_list[direcoryName[2]]+=1
                except:
                    s3_list[direcoryName[2]]=1
    station_list=s3_station()


    while True:
        pages = paginator.paginate(Bucket=bucket,Prefix=section+"/"+str(date_time)+"/")
        s3_list = dict()
        for page in pages:
            for object in page['Contents']:
                direcoryName = object['Key'].split('/')
                if direcoryName[0] == section:
                    try:
                        s3_list[direcoryName[2]] += 1
                    except:
                        s3_list[direcoryName[2]] = 1
        complement = list(set(station_list).difference(find_key(s3_list, section_check)))
        print(complement)
        if not complement:
            break
        else:
            s3_station_upload(complement,section)
        time.sleep(len(complement)*section_check)
