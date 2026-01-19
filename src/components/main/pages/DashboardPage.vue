<template>
  <div class="dashboard-page">
    <div class="dashboard-options">
      <FormSelect
        class="dashboard-select"
        v-model="selectedCity"
        :options="cityOptions"
        placeholder="담당자"
        @change="handleCityChange"
      />

      <ul class="date-tab">
        <li v-for="tab in tabs" :key="tab.value">
          <button :class="{ active: activeValue === tab.value }" @click="handleClick(tab)">
            {{ tab.label }}
          </button>
        </li>
      </ul>
    </div>

    <div class="dashboard-contents">
      <!-- line 01 -->
      <div class="dashboard-row">
        <!-- 등기 견적 관리 -->
        <div class="dashboard-card card30">
          <h4>등기 견적 관리</h4>
          <ul class="dashboard-btn-list">
            <li>
              <router-link to="/estimate">
                <p>견적 요청 건수 :</p>
                <p>
                  <span class="num">00</span>
                  건
                </p>
                <i class="fi fi-rr-angle-circle-right"></i>
                <i class="fi fi-sr-angle-circle-right"></i>
              </router-link>
            </li>
            <li>
              <router-link to="/estimate">
                <p>견적 작성 건수 :</p>
                <p>
                  <span class="num">00</span>
                  건
                </p>
                <i class="fi fi-rr-angle-circle-right"></i>
                <i class="fi fi-sr-angle-circle-right"></i>
              </router-link>
            </li>
            <li>
              <router-link to="/estimate">
                <p>견적 수임 건수 :</p>
                <p>
                  <span class="num">00</span>
                  건
                </p>
                <i class="fi fi-rr-angle-circle-right"></i>
                <i class="fi fi-sr-angle-circle-right"></i>
              </router-link>
            </li>
          </ul>
        </div>

        <!-- 나의 등기 진행 현황 -->
        <div class="dashboard-card card30">
          <h4>나의 등기 진행 현황</h4>
          <ul class="dashboard-btn-list">
            <li>
              <router-link to="/estimate">
                <p>업무 배정 건수 :</p>
                <p>
                  <span class="num">00</span>
                  건
                </p>
                <i class="fi fi-rr-angle-circle-right"></i>
                <i class="fi fi-sr-angle-circle-right"></i>
              </router-link>
            </li>
            <li>
              <p>업무 진행 건수 :</p>
              <p>
                <span class="num">00</span>
                <span>건</span>
              </p>
            </li>
            <li>
              <p>완료·취소 건수 :</p>
              <p>
                <span class="num">00</span>
                <span>건</span>
              </p>
            </li>
          </ul>
        </div>

        <!-- 오늘의 접수 사건 -->
        <div class="dashboard-card card40">
          <h4>
            오늘의 접수 사건
            <router-link to="/estimate" class="more-link"
              ><i class="fi fi-br-plus-small"></i>더보기</router-link
            >
          </h4>
          <ul class="dashboard-btn-list">
            <li>
              <router-link to="/estimate">
                <p>[2025-05-25] BC2025062500001 - 홍길동</p>
                <i class="fi fi-rr-angle-circle-right"></i>
                <i class="fi fi-sr-angle-circle-right"></i>
              </router-link>
            </li>
            <li>
              <router-link to="/estimate">
                <p>[2025-05-25] BC2025062500001 - 홍길동</p>
                <i class="fi fi-rr-angle-circle-right"></i>
                <i class="fi fi-sr-angle-circle-right"></i>
              </router-link>
            </li>
            <li>
              <router-link to="/estimate">
                <p>[2025-05-25] BC2025062500001 - 홍길동</p>
                <i class="fi fi-rr-angle-circle-right"></i>
                <i class="fi fi-sr-angle-circle-right"></i>
              </router-link>
            </li>
          </ul>
        </div>
      </div>

      <!-- line 02 -->
      <div class="dashboard-row" v-if="true">
        <div class="dashboard-card">
          <h4>진행 상태별 업무 현황</h4>

          <!-- TODO: 임시영역 -->
          <div class="catbox">
            <i class="fi fi-sr-cat"></i>
            <p>This area is in a Schrödinger state.</p>
            <i class="fi fi-rr-box-open"></i>
          </div>
        </div>
      </div>

      <!-- line 03 -->
      <div class="dashboard-row">
        <div class="dashboard-card card30">
          <h4>
            공지사항
            <router-link to="/notice" class="more-link"
              ><i class="fi fi-br-plus-small"></i>더보기</router-link
            >
          </h4>

          <ul class="notice-list">
            <li>
              <router-link to="/notice/001">
                <p>여기는 공지사항 제목</p>
                <p>2025.12.16</p>
              </router-link>
            </li>
            <li>
              <router-link to="/notice/001">
                <p>여기는 공지사항 제목 길어지면 이렇게 나옴</p>
                <p>2025.12.16</p>
              </router-link>
            </li>
            <li>
              <router-link to="/notice/001">
                <p>여기는 공지사항 제목</p>
                <p>2025.12.16</p>
              </router-link>
            </li>
            <li>
              <router-link to="/notice/001">
                <p>여기는 공지사항 제목</p>
                <p>2025.12.16</p>
              </router-link>
            </li>
            <li>
              <router-link to="/notice/001">
                <p>여기는 공지사항 제목</p>
                <p>2025.12.16</p>
              </router-link>
            </li>
          </ul>
        </div>

        <div class="dashboard-card card30">
          <h4>서비스 이용 문의</h4>
          <ul class="help-list">
            <li class="call">
              <h4 class="multi-line"><i class="fi fi-sr-phone-call"></i>문의전화</h4>
              <p class="multi-line">070-1234-1234</p>
            </li>
            <li class="time">
              <h4 class="multi-line"><i class="fi fi-sr-user-time"></i>운영시간</h4>
              <p class="multi-line">월~금 09:00~18:00<br /><span>(공휴일 제외)</span></p>
            </li>
          </ul>
        </div>

        <div class="dashboard-card card40">
          <h4>관련 서비스</h4>

          <ul class="service-list">
            <li>
              <a href="#">
                <i class="fi fi-br-folder-download"></i>
                <p>RPA 설치</p>
              </a>
            </li>
            <li>
              <a href="#">
                <i class="fi fi-sr-file-signature"></i>
                <p>전자서명 뷰어</p>
              </a>
            </li>
            <li>
              <a href="#">
                <i class="fi fi-br-data-transfer"></i>
                <p>원격지원</p>
              </a>
            </li>
            <li>
              <a :href="links.register.iros" target="_blank" rel="noopener noreferrer">
                <i class="fi fi-ss-house-building"></i>
                <p>인터넷등기소</p>
              </a>
            </li>
            <li>
              <a :href="links.register.etax" target="_blank" rel="noopener noreferrer">
                <i class="fi fi-sr-square-e"></i>
                <p>이택스</p>
              </a>
            </li>
            <li>
              <a :href="links.register.wetax" target="_blank" rel="noopener noreferrer">
                <i class="fi fi-sr-square-w"></i>
                <p>위택스</p>
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

import FormSelect, { type SelectOption } from '@/components/template/input/UserSelect.vue'
import { useExternalLinks } from '@/composables/useExternalLinks'

const { links } = useExternalLinks()

// 옵션
const cityOptions: SelectOption[] = [
  { label: '김누구', value: 'kim' },
  { label: '이누구', value: 'lee' },
  { label: '박누구', value: 'park' }
]

// 선택된 값들
const selectedCity = ref<string | number | null>('kim')

// 이벤트 핸들러
const handleCityChange = (value: string | number) => {
  console.log('도시가 변경되었습니다:', value)
}

// 탭 데이터 타입
type DateTab = {
  label: string
  value: string
}

// 탭 목록
const tabs = ref<DateTab[]>([
  { label: '1일', value: '1d' },
  { label: '1주', value: '1w' },
  { label: '1개월', value: '1m' }
])

// 현재 활성 탭
const activeValue = ref<string>('1d')

// 클릭 핸들러
const handleClick = (tab: DateTab) => {
  activeValue.value = tab.value
  console.log(tab.value)
}
</script>

<style lang="scss" scoped>
.dashboard-page {
  width: 100%;
  height: auto;
  display: flex;
  position: relative;

  .dashboard-options {
    position: absolute;
    top: -70px;
    display: flex;
    justify-content: flex-end;
    width: 100%;
    height: 40px;

    .dashboard-select {
      width: 130px;
    }

    .date-tab {
      display: flex;
      background-color: #fff;
      border-radius: 5px;
      border: 1px solid #dddddd;
      margin-left: 10px;
      overflow: hidden;
      box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;

      li {
        button {
          width: 80px;
          height: 40px;
          font-size: 16px;
          font-weight: 600;
          color: #bbbbbb;
          line-height: 42px;
          cursor: pointer;

          &.active {
            background-color: #21adad;
            color: #fff;
          }
        }

        border-right: 1px solid #eeeeee;

        &:last-of-type {
          border: 0;
        }
      }
    }
  }

  .dashboard-contents {
    width: 100%;
    height: auto;
    display: flex;
    flex-direction: column;
    gap: 40px;

    .dashboard-row {
      width: 100%;
      height: auto;

      display: flex;
      gap: 20px;

      .dashboard-card {
        width: 100%;
        padding: 25px;
        background-color: #fff;
        border-radius: 10px;
        box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;

        &.card30 {
          width: 30%;
        }

        &.card40 {
          width: 40%;
        }

        > h4 {
          width: 100%;
          margin-bottom: 25px;
          padding-bottom: 20px;
          font-size: 21px;
          border-bottom: 2px solid #dddddd;
          color: #21adad;

          display: flex;
          justify-content: space-between;
          align-items: center;

          .more-link {
            font-size: 14px;
            color: #999999;

            display: flex;
            align-items: center;

            i {
              margin-right: 5px;

              &::before {
                font-size: 14px;
                color: #999999;
              }
            }
          }
        }

        > .dashboard-btn-list {
          width: 100%;
          height: auto;
          display: flex;
          flex-direction: column;
          gap: 10px;

          li {
            margin-bottom: 10px;
            width: 100%;
            min-height: 22px;
            display: flex;
            align-items: center;

            &:last-of-type {
              margin: 0;
            }

            a {
              width: 100%;
              display: flex;
              align-items: center;
            }

            p {
              font-size: 18px;
              font-weight: 600;
              width: 40%;

              display: flex;

              &:nth-of-type(2) {
                width: 35%;
                text-align: right;

                .num {
                  font-family: 'Roboto Mono';
                  font-size: 21px;
                  color: #21adad;
                  margin-right: 5px;
                  margin-left: auto;
                  line-height: 18px;
                }
              }
            }

            i {
              margin-left: auto;
              color: #999999;

              &:first-of-type {
                display: block;
              }
              &:last-of-type {
                display: none;
              }
            }

            &:hover {
              i {
                color: #33cccc;

                &:first-of-type {
                  display: none;
                }
                &:last-of-type {
                  display: block;
                }
              }
            }
          }
        }

        &.card30 {
          width: 30%;
        }

        &.card40 {
          width: 40%;

          > .dashboard-btn-list {
            p {
              width: 100%;
            }
          }
        }

        .notice-list li {
          margin-bottom: 15px;

          &:last-of-type {
            margin: 0;
          }

          a {
            display: flex;
            justify-content: space-between;

            p {
              font-size: 16px;

              &:first-of-type {
                width: 70%;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;

                &:hover {
                  color: #21adad;
                  font-weight: 600;
                }
              }

              &:last-of-type {
                width: 30%;
                text-align: right;

                font-size: 14px;
                line-height: 16px;
                color: #999999;
              }
            }
          }
        }

        .help-list {
          width: fit-content;
          height: 140px;
          display: flex;
          flex-direction: column;
          padding-top: 15px;
          margin: auto;

          li {
            display: flex;

            h4 {
              padding-top: 1px;
              font-size: 18px;
              display: flex;
              margin-right: 20px;
              align-items: flex-start;
              color: #666666;

              i {
                padding-top: 1px;
                margin-right: 10px;
                display: flex;
                align-items: center;
                padding-top: 7px;

                &::before {
                  font-size: 16px;
                }
              }
            }

            p {
              font-weight: 600;
              span {
                font-size: 16px;
                color: #999999;
              }
            }

            &.call {
              margin-bottom: 15px;
            }
          }
        }

        .service-list {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 10px;

          li {
            height: 65px;
            background-color: #eeeeee;
            border: 2px solid #eeeeee;
            border-radius: 5px;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: 0.3s;

            a {
              width: 100%;
              height: 100%;
              display: flex;
              gap: 7px;
              align-items: center;
              justify-content: center;

              i {
                display: flex;
                align-items: center;

                &::before {
                  font-size: 20px;
                  color: #999999;
                }
              }

              p {
                font-size: 15px;
                color: #666666;
              }
            }

            &:hover {
              background-color: #ebf7f8;
              border: 2px solid #33cccc;

              a {
                i {
                  &::before {
                    color: #33cccc;
                    transition: 0.3s;
                  }
                }

                p {
                  color: #21adad;
                  font-weight: 600;
                }
              }
            }
          }
        }
      }
    }
  }
}

// TODO: 임시영역
.catbox {
  background-color: #eeeeee;
  height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #999999;

  p {
    color: #999999;
    font-size: 28px;
    margin: 0 20px;
  }

  i::before {
    font-size: 32px;
  }
}
</style>
