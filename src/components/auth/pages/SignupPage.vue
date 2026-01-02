<template>
  <div class="signup-page">
    <div class="signup-header">
      <i class="fi fi-sr-member-list"></i>

      <div class="right">
        <h1>회원가입</h1>
        <p>회원가입 정보 등록 이후 사용자 승인이 완료되어야만 시스템 사용이 가능합니다.</p>
      </div>
    </div>

    <div class="signup-contents">
      <ul>
        <li
          v-for="(section, index) in sections"
          :key="index"
          :class="{ active: openSections.includes(index) }"
        >
          <h1 @click="toggleAccordion(index)">
            {{ section.title }}
            <i class="fi fi-rr-caret-down" :class="{ rotate: openSections.includes(index) }"></i>
          </h1>
          <div
            class="content-wrapper"
            :class="{ open: openSections.includes(index) }"
            :style="{
              maxHeight: openSections.includes(index) ? contentHeights[index] + 'px' : '0'
            }"
            :ref="(el) => setContentRef(el, index)"
          >
            <div class="content">
              {{ section.content }}
            </div>
          </div>
        </li>
        <li class="button-group">
          <button class="cancel">취소</button>
          <button class="submit">회원가입</button>
        </li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { nextTick, onMounted, ref } from 'vue'

interface Section {
  title: string
  content: string
}

const sections: Section[] = [
  { title: '기관 등록 정보', content: '기관 등록 정보 내용' },
  { title: '지점 등록 정보', content: '지점 등록 정보 내용' },
  { title: '기관 관리자 등록 정보', content: '기관 관리자 등록 정보 내용' }
]

const openSections = ref<number[]>([0, 1, 2])
const contentHeights = ref<number[]>([])
const contentRefs = ref<(HTMLElement | null)[]>([])

const setContentRef = (el: any, index: number) => {
  if (el) {
    contentRefs.value[index] = el
  }
}

const calculateHeights = () => {
  contentRefs.value.forEach((wrapper, index) => {
    if (wrapper) {
      const content = wrapper.querySelector('.content') as HTMLElement
      if (content) {
        contentHeights.value[index] = content.scrollHeight
      }
    }
  })
}

const toggleAccordion = (index: number) => {
  const idx = openSections.value.indexOf(index)
  if (idx > -1) {
    openSections.value.splice(idx, 1)
  } else {
    openSections.value.push(index)
  }
}

onMounted(() => {
  nextTick(() => {
    calculateHeights()
  })
})
</script>

<style lang="scss" scoped>
.signup-page {
  width: 100%;
  height: auto;
  display: flex;
  flex-direction: column;

  .signup-header {
    margin: 70px 40px 60px 40px;
    padding-bottom: 60px;
    display: flex;
    vertical-align: baseline;
    align-items: center;
    justify-content: center;
    gap: 60px;

    border-bottom: 6px solid #ebf7f8;
    border-radius: 3px;

    i {
      font-size: 60px;

      &::before {
        position: 0;
        font-size: 60px;
        color: #33cccc;
      }
    }

    .right {
      display: flex;
      flex-direction: column;

      h1 {
        margin-bottom: 15px;
        color: #21adad;
      }
    }
  }

  .signup-contents {
    ul {
      list-style: none;
      padding: 0 40px;

      li {
        margin-bottom: 20px;

        &:not(.button-group) {
          border: 1px solid #e0e0e0;
          border-radius: 8px;
          overflow: hidden;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

          &.active {
            border-color: #33cccc;
            box-shadow: 0 2px 8px rgba(51, 204, 204, 0.15);
          }
        }

        h1 {
          padding: 20px;
          margin: 0;
          display: flex;
          justify-content: space-between;
          align-items: center;
          cursor: pointer;
          background-color: #f8f9fa;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          user-select: none;
          font-size: 21px;

          &:hover {
            background-color: #ebf7f8;
          }

          i {
            transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
            color: #666;
            font-size: 18px;

            &.rotate {
              transform: rotate(180deg);
            }
          }
        }

        .content-wrapper {
          overflow: hidden;
          transition: max-height 0.5s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .content {
          padding: 20px;
          background-color: #fff;
          opacity: 0;
          transform: translateY(-10px);
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);

          .open & {
            opacity: 1;
            transform: translateY(0);
          }
        }

        &.button-group {
          display: flex;
          justify-content: center;
          gap: 15px;
          margin-top: 40px;

          button {
            padding: 12px 40px;
            border: none;
            border-radius: 6px;
            font-size: 16px;
            cursor: pointer;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

            &.cancel {
              background-color: #f0f0f0;
              color: #666;

              &:hover {
                background-color: #e0e0e0;
                transform: translateY(-2px);
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
              }
            }

            &.submit {
              background-color: #21adad;
              color: white;

              &:hover {
                background-color: #1a8a8a;
                transform: translateY(-2px);
                box-shadow: 0 4px 12px rgba(33, 173, 173, 0.3);
              }
            }

            &:active {
              transform: translateY(0);
            }
          }
        }
      }
    }
  }
}
</style>
