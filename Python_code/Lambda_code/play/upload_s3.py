import boto3
from datetime import datetime
from pytz import timezone

# json 형식으로 파일 저장
def upload_s3(directory, jsondata, station, category):
    bucket = 'stationjsondata'

    try:
        s3 = boto3.client('s3', aws_access_key_id='',
                          aws_secret_access_key='')
    except:
        print("boto3 client error", station, category)

    date_time = datetime.now(timezone('Asia/Seoul')).strftime('%Y-%m-%d')
    try:
        s3.put_object(Body=jsondata,
                      Bucket=bucket,
                      Key='{}/{}/{}/{}.json'.format(
                          directory,
                          date_time,
                          station,
                          category
                      )
                      )
    except:
        print("boto3 put_object error", station, category)
