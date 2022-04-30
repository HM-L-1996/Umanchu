# -*- coding: utf-8 -*-
import pyspark
from pyspark.sql.types import StringType, StructType, StructField
from pyspark.sql import SQLContext
import pyspark.sql.functions as f
import pandas as pd
import json
from ast import literal_eval
from sklearn.feature_extraction.text import CountVectorizer  # 피체 벡터화
from sklearn.metrics.pairwise import cosine_similarity  # 코사인 유사도
import pymysql
import logging
from datetime import datetime
from pytz import timezone
from common import dict_list_a,station_crawling,find_simi_place


def food():
    try:
        sc = pyspark.SparkContext()
    except:
        sc.stop()
        sc = pyspark.SparkContext()
    sqlContext = SQLContext(sc)
    sqlContext.setConf("spark.sql.autoBroadcastJoinThreshold", "-1")
    # spark DataFrame 구조 지정
    schema = StructType(
        [
            StructField('id', StringType(), False),
            StructField('name', StringType(), False),
            StructField('category', StringType(), False),
            StructField('tel', StringType(), True),
            StructField('addr', StringType(), False),
            StructField('bizhour', StringType(), True),
            StructField('context', StringType(), True),
            StructField('menu', StringType(), True),
            StructField('reviewcount', StringType(), True),
            StructField('microreview', StringType(), True),
            StructField('thumbnail', StringType(), True),
            StructField('lat', StringType(), True),
            StructField('lng', StringType(), True),
            StructField('ranking', StringType(), True),
            StructField('category_1', StringType(), False),
            StructField('category_2', StringType(), True),
        ]
    )

    # 2차 딕셔너리 category_3 지정
    dict_2 = {
              '한식': {'국밥': ['순대,순댓국', '국밥'], '죽': ['죽'],
                     '해물,생선요리': ['복어요리', '대게요리', '생선회', '오징어요리', '주꾸미요리', '해물,생선요리', '낙지요리',
                                 '조개요리', '게요리', '굴요리', '매운탕,해물탕', '일석삼조버섯매운탕', '생선구이', '아귀찜,해물찜', '장어,먹장어요리'],
                     '찌개,전골': ['찌개,전골', '아부찌부대찌개'],
                     '면요리': ['칼국수,만두', '국수', '냉면', '막국수'],
                     '닭요리': ['닭갈비', '찜닭', '닭발', '닭볶음탕', '닭요리', '백숙,삼계탕'],
                     '육류,고기요리': ['오리요리', '육류,고기요리', '곱창,막창,양',
                                 '문래돼지불백', '소고기구이', '돼지고기구이', '족발,보쌈', '장수한우곱창', '고기원칙', '정육식당'],
                     '백반,가정식': ['향토음식', '한정식', '곰탕,설렁탕', '추어탕', '감자탕', '갈비탕', '백반,가정식', '두부요리', '보리밥', '비빔밥', '쌈밥'],
                     '기타': ['음식점', '기사식당', '사찰음식', '사철,영양탕', '한식뷔페', '이북음식', '전,빈대떡', '해장국']
                     },
              '중식': {'중식당': ['중식당', '일품향'],
                     '꼬치류': ['양꼬치'],
                     '만두': ['딤섬,중식만두'],
                     '튀김류': ['바람난탕수육'],
                     '사천 요리': ['신룽푸마라탕'],
                     '기타': ['푸드코트', '포장마차', '요리주점', '아시아음식', '음식점', '술집', '야식']
                     },
              '일식': {
                  '일식당': ['일식당'],
                  '구이,튀김': ['돈가스', '시로이돈까스',
                            '일식튀김,꼬치', '101번지남산돈까스', '미스터빠삭', '피자', '치킨,닭강정'],
                  '쌀요리': ['초밥,롤', '덮밥', '카레', '오니기리',
                          '일식,초밥뷔페', '도시락,컵밥', '오므라이스', '고레카레'],
                  '이자카야': ['술집', '이자카야'],
                  '면요리': ['우동,소바', '일본식라면'],
                  '생선요리': ['생선회', '이자카야'],
                  '전골': ['샤브샤브'],
                  '기타': ['음식점', '한식', '기업', '프랜차이즈본사', '육류,고기요리', '중식', '중식당']
              },
              '카페': {
                  '브런치': ['브런치', '테이크아웃커피'],
                  '디저트 카페': ['카페,디저트', '차', '와플', '95도씨카페', '슈',
                             '빙수', '과일,주스전문점', '바나프레소', '호두과자', '초콜릿전문점', '홍차전문점', '블루보틀'],
                  '베이커리 카페': ['베이커리', '케이크전문', '아이스크림', '도넛', '베이글', '자연식빵', '찐빵'],
                  '스터디카페': ['스터디카페', '북카페', '24시프리카페'],
                  '이색카페': ['애견카페', '보드카페', '테마카페', '고양이카페', '떡카페', '슬라임카페',
                           '룸카페', '라이브카페', '갤러리카페', '플라워카페', '다방', '힐링카페', '키즈카페,실내놀이터'],
                  '기타': ['공방', '생활,편의', '복합문화공간', '문화,예술', '쇼핑,유통', '과자,사탕,초코렛',
                         '여행,명소', '거리,골목', '양식', '임대업', '죽', '음식점', '서비스,산업', '스마일찹쌀꽈배기',
                         '장소대여', '오락시설', '만화방', '스포츠,오락', '플레이스테이션방', '인쇄업', '프린트인쇄', 'THE달달']

              },
              '양식': {
                  '브런치': ['샌드위치', '브런치'],
                  '이탈리아음식': ['피자', '스파게티,파스타전문',
                             '이탈리아음식', '서오릉피자', '스파게티스토리'],
                  '멕시코,남미음식': ['멕시코,남미음식', ],
                  '서양음식': ['햄버거', '스테이크,립', '핫도그',
                           '후렌치후라이', '프랑스음식', '스페인음식', '터키음식', '독일음식', '치킨,닭강정'],
                  '기타': ['뷔페', '푸드코트', '일식당', '일식', '해물,생선요리', '바닷가재요리', '음식점', '한식', '백반,가정식', '기업', '프랜차이즈본사', '어업',
                         '양어,양식업', '']

              },
              '술집': {
                  '맥주,호프': ['맥주,호프', '치킨,닭강정', '강남맥주'],
                  '전통,민속주점': ['전통,민속주점', '한식', '대반전'],
                  '포장마차': ['포장마차', '오뎅,꼬치', '곱창,막창,양', '닭갈비'],
                  '이자카야': ['이자카야', '일식', '일식당'],
                  '바(BAR)': ['바(BAR)', '와인', '양식', '바메디컬팀'],
                  '유흥주점': ['유흥주점', '단란주점'],
                  '요리주점': ['조개요리', '족발,보쌈', '요리주점', '음식점', '스테이크,립', '육류,고기요리', '이탈리아음식', '안경할머니곱창'],
                  '기타': ['기업', '프랜차이즈본사']
              }}
    # Data Loads
    categories = ['한식', '중식', '일식', '양식', '카페', '술집', '고기집', '해산물', '분식', '아시안']

    for station in station_crawling():
        host = ''
        port = 3306
        username = ''
        database = ''
        password = ''
        conn = pymysql.connect(host=host, user=username, passwd=password, db=database, port=port, charset='utf8mb4',
                               cursorclass=pymysql.cursors.DictCursor)
        cursor = conn.cursor()

        print(station)

        sqlCtx = SQLContext(sc)
        df_empty = pd.DataFrame(
            columns=['id', 'name', 'category', 'tel', 'address', 'bizhourInfo', 'context', 'menuInfo', 'reviewCount',
                     'microReview', 'thumUrl', 'y', 'x', 'rank', 'category_1', 'category_2'])

        for category in categories:
            # Data Load
            inputJson = sc.textFile("s3://stationjsondata/food/{}/{}/{}.json".format(
                str(datetime.now(timezone('Asia/Seoul')).strftime('%Y-%m-%d')), station, category)) \
                .map(lambda x: json.loads(x)).collect()
            try:
                for datas in inputJson:
                    json_data = json.loads(datas)
                    js_data = json_data["result"]["place"]["list"]
                    json_df = pd.json_normalize(js_data)
                    df_ = json_df[
                        ['id', 'name', 'category', 'tel', 'address', 'bizhourInfo', 'context', 'menuInfo',
                         'reviewCount','microReview', 'thumUrl', 'y', 'x', 'rank']]
                    df_['category_1'] = category
                    df_['category_2'] = df_['category'].map(lambda x: ["'" + k + "'" for k in x if k != category])
                    df_empty = pd.concat([df_empty, df_])
            except:
                continue
        try:
            df_empty1 = df_empty.drop_duplicates(['id'])
            # convert pandas to spark dataframe
            df_ = sqlCtx.createDataFrame(df_empty1, schema)
            # 장소 정보 데이터 sql insert
            df_.select('id', 'name', 'tel', 'addr', 'bizhour', 'context', 'menu', 'reviewcount', 'microreview', 'thumbnail',
                       'lat', 'lng', 'ranking').write.mode("append").format("jdbc") \
                .option("url", "jdbc:mysql://" + host + ":3306/umanchu?useUnicode=true&characterEncoding=UTF-8") \
                .option("driver", "com.mysql.cj.jdbc.Driver").option("dbtable", "{}_id_info".format(str(station))) \
                .option("user", username).option("password", password).save()
            df = sqlCtx.createDataFrame(df_empty, schema)
        except:
            continue
        # ----Data Preprocessing----
        df_new = df.select(  # 3
            df.id,
            df.name,
            df.category_1,
            df.category_2,
            df.ranking
        ).cache()

        df_all = df_new.filter(df_new.category_2.isNotNull())
        try:
            targetDf = df_all.rdd.map(
                lambda x: (x.id, x.name, str(x.category_1), literal_eval(x.category_2), x.ranking)).toDF(
                ['id', 'name', 'category_1', 'category_2', 'ranking'])
        except:
            continue

        ######################
        for category in list(dict_2.keys()):
            print(category)
            try:
                targetDf_category = targetDf.filter(targetDf.category_1 == category)
                targetDf_category = targetDf_category.rdd.map(lambda x: (
                x.id, x.name, x.category_1, x.category_2, dict_list_a(x.category_1, x.category_2, dict_2), x.ranking)).toDF(
                    ['id', 'name', 'category_1', 'category_2', 'category_3', 'ranking'])
            except:
                continue
            targetDf_category = targetDf_category.rdd.map(
                lambda x: (
                    x.id, x.name, x.category_1, x.category_2, str(x.category_3),
                    str(str(x.category_3) + " " + str(x.category_2)), x.ranking)
                ).toDF(['id', 'name', 'category_1', 'category_2', 'category_3', 'cate_mix', 'ranking'])
            df_ = targetDf_category.withColumn('cate_mix', f.regexp_replace(f.col('cate_mix'), "\\]", ""))
            df_ = df_.withColumn('cate_mix', f.regexp_replace(f.col('cate_mix'), "\\[", ""))
            df_ = df_.withColumn('cate_mix', f.regexp_replace(f.col('cate_mix'), "\\'", ""))
            # ScikitLearn 모듈 사용을 위한 pandas화
            result = df_.select("*").toPandas()
            result = result.astype({'ranking': 'int'}
            # 문서 집합에서 단어 토큰을 생성하고 각 단어의 수를 최소 빈도 0으로 두고 범위는 (1, 2) 튜플로 둔다
            count_vect_category = CountVectorizer(min_df=0, ngram_range=(1, 2))
            # 하나로 뭉쳐진 카테고리 텍스트 데이터를 피쳐 벡터화함
            place_category = count_vect_category.fit_transform(result['cate_mix'])
            # 카테고리가 서로 얼마나 유사한 지 코사인 유사도 계산
            place_simi_cate = cosine_similarity(place_category, place_category)
            # 유사도 matrix를 인덱스로 내림차순 정렬
            place_simi_cate_sorted_ind = place_simi_cate.argsort()[:, ::-1]

            for k in list(dict_2[category].keys()):
                station_tag_rec = find_simi_place(result, place_simi_cate_sorted_ind, k, 50)
                try:
                    for index, row in station_tag_rec.iterrows():
                        sql = "insert into {}_tag (id,category1,category2,score,section) values({},{},{},{},1)".format(
                            station,
                            int(row['id']),
                            "'" + row['category_1'] + "'",
                            "'" + k + "'",
                            float(row['score'])
                            )
                        cursor.execute(sql)
                except:
                    logging.error("error connection to RDS")
            conn.commit()
        conn.close()
    sc.stop()
food()
