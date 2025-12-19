<template>
  <div class="mob-content">
    <div class="mobile-error-page">
      <img src="@/assets/images/error/mobile-phone.svg" alt="icon" />
      <h4>Mobile 서비스 준비 중</h4>

      <p class="multi-line small">
        Mobile에서 서비스를 이용할 수 있도록
        <br />
        열심히 개발하고 있습니다.
        <br />
        서비스 오픈 시 공지사항을 통해 알려드리겠습니다.
      </p>

      <div class="error-help-box">
        <p class="multi-line small">
          ※ 시스템 접속이 원활하지 않을 경우, 아래의 고객센터로 연락주시기 바랍니다.
        </p>

        <ul>
          <li>
            <p class="title">문의전화</p>
            <p>070-1234-1234</p>
          </li>
          <li>
            <p class="title">운영시간</p>
            <p>
              월~금 09:00~18:00
              <br />
              <span>(공휴일 제외)</span>
            </p>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup></script>

<style lang="scss" scoped>
.mobile-error-page {
  width: 100%;
  max-width: 600px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  margin: 60px auto;

  > img {
    height: 150px;
    margin-right: 10px;
    margin-bottom: 40px;
  }

  > h4 {
    color: #33cccc;
    margin-bottom: 40px;
  }

  > p {
    text-align: center;
  }
}

.error-help-box {
  padding: 20px 30px;
  border-radius: 10px;
  background-color: #ffffff;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 40px;

  > p {
    text-align: center;
    margin-bottom: 20px;
  }

  > ul {
    li {
      display: flex;

      &:first-of-type {
        margin-bottom: 10px;
      }

      > p {
        font-size: 14px;
        font-weight: 600;
        line-height: 1.6;

        span {
          font-size: 12px;
          color: #999999;
        }
      }

      > p.title {
        min-width: 60px;
        color: #21adad;
      }
    }
  }
}
</style>
