import requests
import time
import random
import json

from upload_s3 import upload_s3


def navermap_food(station):
    categories = ['한식', '중식','일식','양식', '카페', '술집', '고기집', '해산물', '분식', '아시안']
    # 크롤링 URL 설정
    error_station = ""

    url = 'https://map.naver.com/v5/api/search'
    for category in categories:
        time.sleep(random.randint(5, 15))
        params = {
            'caller': 'pcweb',
            'query': station + ' ' + category,
            'type': 'place',
            'searchCoord': '127.0406198501587;37.51741907323963',
            'page': '1',
            'displayCount': '100',
            'isPlaceRecommendationReplace': 'true',
            'lang': 'ko'
        }
        try:
            response = requests.get(url, params=params)
        except:
            print("Not requests----")
        try:
            if response.text == "Moved Permanently. Redirecting to https://map.naver.com/v5/":
                error_station = error_station + station + category + " "
            else:
                # json 형식으로 파일 저장
                response_json = json.dumps(response.text, ensure_ascii=False).encode('UTF-8')
                upload_s3('food', response_json, station, category)
        except json.JSONDecodeError:
            print('JSONDecodeError--: ', station, category)
        except:
            print('No Data')

    return error_station

