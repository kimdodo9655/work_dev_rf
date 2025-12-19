<template>
  <div class="all-content-inner">
    <div class="error-area">
      <div class="error-box">
        <div class="cont-top">
          <img src="@/assets/images/error/computer-error.svg" alt="" />

          <div>
            <h1>Mac OS 서비스 제한</h1>

            <p class="multi-line">
              Mac OS 보안 정책으로 인해 필수 보안 프로그램이 정상적으로 설치가 되지 않고 있습니다.
              <br />
              안정적인 시스템 이용을 위해 Window OS 단말기로 접속 바랍니다.
            </p>
          </div>
        </div>

        <div class="error-help-box">
          <p>※ 시스템 접속이 원활하지 않을 경우, 아래의 고객센터로 연락주시기 바랍니다.</p>

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
  </div>
</template>

<script lang="ts" setup></script>

<style lang="scss" scoped>
.error-area {
  display: flex;
  min-height: 100vh;

  align-items: center;
  justify-content: center;
}

.error-box {
  height: auto;
  margin: 80px auto 160px;

  .cont-top {
    display: flex;
    margin-bottom: 40px;

    > img {
      height: 200px;
    }
    > div {
      display: flex;
      flex-direction: column;
      justify-content: center;
      margin-left: 60px;
      h1 {
        color: #33cccc;
        margin-bottom: 20px;
      }
    }
  }

  .error-help-box {
    background-color: #ffffff;
    border-radius: 10px;
    padding: 30px;

    > p {
    }
  }
}
</style>
