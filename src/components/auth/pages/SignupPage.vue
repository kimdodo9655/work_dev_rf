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
      <AccordionGroup mode="multiple" :default-open="[0, 1, 2]" :allow-empty="true">
        <ul>
          <AccordionItem :index="0">
            <template #title>기관 등록 정보</template>
            <template #content>
              <div class="signup-list-content">
                <h4><i class="fi fi-ss-circle"></i>기관 기본 정보</h4>

                <table class="data-table">
                  <thead>
                    <tr>
                      <th>기관구분</th>
                      <th>기관명칭</th>
                      <th>법인등록번호</th>
                      <th>대표자명</th>
                      <th>본점 주소</th>
                      <th>사용유무</th>
                      <th>상세</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>법무사사무소</td>
                      <td>뱅클법무사사무소</td>
                      <td>101111-1234567</td>
                      <td>김대표</td>
                      <td>서울특별시 용산구 이태원동 1234번지 뱅클법무사빌딩 201호</td>
                      <td>승인대기</td>
                      <td>
                        <button class="detail-btn" type="button">
                          <i class="fi fi-sr-angle-circle-right"></i>
                        </button>
                      </td>
                    </tr>
                    <tr class="no-input-data">
                      <td colspan="7">
                        <p class="multi-line">
                          작성된 기관 기본 정보가 없습니다.
                          <br />
                          정보 등록 버튼을 클릭하여 새로운 기관 정보를 등록 바랍니다.
                        </p>
                        <button type="button"><i class="fi fi-rr-multiple"></i>정보등록</button>
                      </td>
                    </tr>
                    <tr class="info-text">
                      <td colspan="7">
                        * 기관 기본 정보는 회원가입 후 수정이 불가하오니 정확하게 입력 바랍니다.
                        회원 가입 후 수정이 필요한 경우 고객센터로 연락 바랍니다
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </template>
          </AccordionItem>

          <AccordionItem :index="1">
            <template #title>지점 등록 정보</template>
            <template #content>
              <div class="signup-list-content">
                <h4><i class="fi fi-ss-circle"></i>지점 사업자 정보</h4>

                <table class="data-table mb-40">
                  <thead>
                    <tr>
                      <th>지점명칭</th>
                      <th>사업자등록번호</th>
                      <th>사업장 소재지</th>
                      <th>사업장 전화번호</th>
                      <th>자격자구분</th>
                      <th>자격자성명</th>
                      <th>사용유무</th>
                      <th>상세</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>본점</td>
                      <td>123-12-12345</td>
                      <td>서울특별시 용산구 이태원동 1234번지 뱅클법무사빌딩 201호</td>
                      <td>02-1234-1234 (123)</td>
                      <td>법무사</td>
                      <td>김법률</td>
                      <td>승인대기</td>
                      <td>
                        <button class="detail-btn" type="button">
                          <i class="fi fi-sr-angle-circle-right"></i>
                        </button>
                      </td>
                    </tr>
                    <tr class="no-input-data">
                      <td colspan="8">
                        <p class="multi-line">
                          작성된 기관 기본 정보가 없습니다.
                          <br />
                          정보 등록 버튼을 클릭하여 새로운 기관 정보를 등록 바랍니다.
                        </p>
                        <button type="button"><i class="fi fi-rr-multiple"></i>정보등록</button>
                      </td>
                    </tr>
                    <tr class="info-text">
                      <td colspan="8">
                        * 기관 기본 정보는 회원가입 후 수정이 불가하오니 정확하게 입력 바랍니다.
                        회원 가입 후 수정이 필요한 경우 고객센터로 연락 바랍니다
                      </td>
                    </tr>
                  </tbody>
                </table>

                <h4><i class="fi fi-ss-circle"></i>배정 금융기관 정보</h4>
                <table class="data-table">
                  <colgroup>
                    <col style="width: 150px" />
                    <col />
                    <col style="width: 100px" />
                  </colgroup>
                  <thead>
                    <tr>
                      <th>등기유형</th>
                      <th>배정 금융기관</th>
                      <th>상세</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <th>소유권이전</th>
                      <td>승인대기</td>
                      <td>
                        <button class="detail-btn" type="button">
                          <i class="fi fi-sr-angle-circle-right"></i>
                        </button>
                      </td>
                    </tr>
                    <tr>
                      <td>김법률</td>
                      <td>승인대기</td>
                      <td>
                        <button class="detail-btn" type="button">
                          <i class="fi fi-sr-angle-circle-right"></i>
                        </button>
                      </td>
                    </tr>
                    <tr class="no-input-data">
                      <td colspan="8">
                        <p class="multi-line">
                          작성된 기관 기본 정보가 없습니다.
                          <br />
                          정보 등록 버튼을 클릭하여 새로운 기관 정보를 등록 바랍니다.
                        </p>
                        <button type="button"><i class="fi fi-rr-multiple"></i>정보등록</button>
                      </td>
                    </tr>
                    <tr class="info-text">
                      <td colspan="8">
                        * 기관 기본 정보는 회원가입 후 수정이 불가하오니 정확하게 입력 바랍니다.
                        회원 가입 후 수정이 필요한 경우 고객센터로 연락 바랍니다
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </template>
          </AccordionItem>

          <AccordionItem :index="2">
            <template #title>기관 관리자 등록 정보</template>
            <template #content>
              <div class="signup-list-content">
                <h4><i class="fi fi-ss-circle"></i>기관 관리자 정보</h4>
                <h4><i class="fi fi-ss-circle"></i>담당 금융기관 정보</h4>
              </div>
            </template>
          </AccordionItem>

          <li class="button-group">
            <button type="button">취소</button>
            <button type="button">회원가입</button>
          </li>
        </ul>
      </AccordionGroup>
    </div>
  </div>
</template>

<script lang="ts" setup>
import AccordionGroup from '@/components/template/AccordionGroup.vue'
import AccordionItem from '@/components/template/AccordionItem.vue'
</script>
