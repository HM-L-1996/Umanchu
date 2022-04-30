from bs4 import BeautifulSoup
from html_table_parser import parser_functions
import requests
import re
import numpy as np
import pandas as pd
def dict_list_0(data, dict):
    for key in dict.keys():
        if data in dict[key]:
            return_key = key
    return return_key

# 서울 시 내의 지하철 역 목록 크롤링
def station_crawling():
    link = 'https://ko.wikipedia.org/wiki/%EC%88%98%EB%8F%84%EA%B6%8C_%EC%A0%84%EC%B2%A0%EC%97%AD_%EB%AA%A9%EB%A1%9D'
    headers = {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/97.0.4692.99 Safari/537.36'}
    req = requests.get(link, headers=headers)
    soup = BeautifulSoup(req.text, 'html.parser')
    data = soup.find_all('table', {'class': 'wikitable'})
    station_list = []
    for i in range(len(data)):
        table = parser_functions.make2d(data[i])
        df = pd.DataFrame(data=table[1:], columns=table[0])
        dfresult = df[df['소재지'].str.contains("서울특별시", na=False, case=False)]
        station_list.append(dfresult)
    station_df = pd.concat(station_list, ignore_index=True)
    regex = "\(.*\)|\s-\s.*"
    tmp = station_df['철도역'].tolist()
    station_return = [re.sub(regex, '', s) + "역" for s in tmp]
    station_return = list(set(station_return))
    station_return = sorted(station_return)
    return station_return


def find_simi_place(result, sorted_ind, place_name, top_n):
    result = result.reset_index(drop=True)
    place_title = result[result['category_3'].str.contains(place_name)]
    place_index = place_title.index.values

    #  영화 기반인 유사도 추천은 영화 이름이 가진 index 값 하나만 가져오기때문에 쉽게 출력할 수 있다
    #  추천하려는 카테고리의 인덱스에따라 각각의 리스트가 형성된다.
    #  1차 처리 = 인덱스 리스트를 형성
    similar_indexes = sorted_ind[place_index, :(top_n)]
    similar_indexes = similar_indexes.reshape(-1)

    #   유사한 카테고리에 따라 추천하는 데이터프레임
    result = result.iloc[similar_indexes]

    #   2차로는 인덱스에 따라 카테고리가 유사한 값을 각각의 리스트 30위권으로 추출
    a = place_simi_cate[place_index, :(top_n)].reshape(-1, 1)

    #   카테고리 유사도값이 제일 높은 순위로 다시 정렬한다
    a = np.sort(a, axis=0)[::-1]

    #   score로 유사도값 저장 + 1-0.01 * ranking으로 점수부여
    result.insert(0, 'score', a)
    result['score'] = result['score'] + (1 - 0.01 * result['ranking'])

    #   각각의 리스트 50권위에서 추천하려는 카테고리만 출력하고 리스트에서 중복된 이름은 제거하고 score을 내림차순으로 정렬
    return result[result['category_3'].str.contains(place_name)].sort_values('score', ascending=False).drop_duplicates('name')


def dict_list_a(category_1, category_2, dict):
    dict_list = []
    for value in category_2:
        for x in list(dict[category_1].keys()):
            if value in dict[category_1][x]:
                dict_list.append(x)
    dict_list = list(set(dict_list))
    return dict_list