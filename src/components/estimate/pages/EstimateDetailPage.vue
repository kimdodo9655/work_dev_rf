<template>
  <div>
    <h1>
      [공용] 견적서 작성/제출 or 확인/철회 상세
      <br />
      EstimateDetailPage &#128187;
    </h1>
    <button @click="goBack">
      <span>← 이전</span>
    </button>

    <table class="data-table">
      <thead>
        <tr>
          <th colspan="2">통기 진행 방식</th>
          <th>전자등기</th>
        </tr>
      </thead>
      <tbody>
        <!-- 보수료 섹션 -->
        <tr class="section-header">
          <td rowspan="11" class="section-label">세부<br />내역</td>
          <td>보수료 합계</td>
          <td class="amount">0 원</td>
          <td rowspan="11" class="section-label">세부<br />내역</td>
          <td>공과금 합계</td>
          <td class="amount">0 원</td>
        </tr>
        <tr>
          <td class="indent">- 기본 보수</td>
          <td class="amount">0 원</td>
          <td class="indent">- 취득세</td>
          <td class="amount">0 원</td>
        </tr>
        <tr>
          <td class="indent">- 가산 보수</td>
          <td class="amount">0 원</td>
          <td class="indent">- 등록면허세</td>
          <td class="amount">0 원</td>
        </tr>
        <tr>
          <td class="indent">- 재중명 비용</td>
          <td class="amount">0 원</td>
          <td class="indent">- 교육세</td>
          <td class="amount">0 원</td>
        </tr>
        <tr>
          <td class="indent">- 등기원인증서 작성</td>
          <td class="amount">0 원</td>
          <td class="indent">- 농어촌특별세</td>
          <td class="amount">0 원</td>
        </tr>
        <tr>
          <td class="indent">- 공과금 산고/납부 대행</td>
          <td class="amount">0 원</td>
          <td class="indent">- 인지세</td>
          <td class="amount">0 원</td>
        </tr>
        <tr>
          <td class="indent">- 국민주택채권 증서에도 대행</td>
          <td class="amount">0 원</td>
          <td class="indent">- 등기신청수수료</td>
          <td class="amount">0 원</td>
        </tr>
        <tr>
          <td class="indent">- 검인/부동산거래신고 대행</td>
          <td class="amount">0 원</td>
          <td></td>
          <td></td>
        </tr>
        <tr>
          <td class="indent">- 실비변상(교통비/숙박비/일당)</td>
          <td class="amount">0 원</td>
          <td></td>
          <td></td>
        </tr>
        <tr>
          <td class="indent">- 확인서면</td>
          <td class="amount">0 원</td>
          <td></td>
          <td></td>
        </tr>
        <tr>
          <td class="indent">- 기타 비용</td>
          <td class="amount">0 원</td>
          <td></td>
          <td></td>
        </tr>
        <tr>
          <td></td>
          <td class="indent">- 부가가치세</td>
          <td class="amount">0 원</td>
          <td></td>
          <td></td>
          <td></td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script lang="ts" setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const goBack = () => {
  // 히스토리가 있으면 뒤로가기, 없으면 홈으로
  if (window.history.length > 1) {
    router.back()
  } else {
    router.push('/')
  }
}
</script>
