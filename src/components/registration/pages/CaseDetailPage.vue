<template>
  <section class="detail-layout">
    <!-- 좌측: 비워두는 영역(폭 200px) -->
    <aside class="sidebar" aria-hidden="true"></aside>

    <!-- 우측: 전체 UI -->
    <main class="content">
      <div class="accordion">
        <!-- 1) 등기 의뢰 정보 -->
        <AccordionSection title="등기 의뢰 정보" :is-open="openMap.REQ" @toggle="toggle('REQ')">
          <RequestInfoSection
            :registry-management-number="registryManagementNumber"
            :is-open="openMap.REQ"
          />
        </AccordionSection>

        <!-- 2) 등기신청서 정보 등록 -->
        <AccordionSection
          title="등기신청서 정보 등록"
          :is-open="openMap.APP"
          @toggle="toggle('APP')"
        >
          <ApplicationSection
            :registry-management-number="registryManagementNumber"
            :is-open="openMap.APP"
          />
        </AccordionSection>

        <!-- 3) 행정정보 제공 요구 동의요청 -->
        <AccordionSection
          v-show="showAdminSection"
          title="행정정보 제공 요구 동의요청"
          :is-open="openMap.ADMIN"
          @toggle="toggle('ADMIN')"
        >
          <AdminSection
            :registry-management-number="registryManagementNumber"
            :is-open="openMap.ADMIN"
            @loaded="handleAdminLoaded"
          />
        </AccordionSection>

        <!-- 4) 등기 진행 정보 등록 -->
        <AccordionSection
          title="등기 진행 정보 등록"
          :is-open="openMap.PROG"
          @toggle="toggle('PROG')"
        >
          <ProgressSection
            :registry-management-number="registryManagementNumber"
            :is-open="openMap.PROG"
          />
        </AccordionSection>
      </div>
    </main>
  </section>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'

import { useAccordionState } from '@/composables/utils/useAccordionState'

import AccordionSection from './AccordionSection.vue'
import AdminSection from './AdminSection.vue'
import ApplicationSection from './ApplicationSection.vue'
import ProgressSection from './ProgressSection.vue'
import RequestInfoSection from './RequestInfoSection.vue'

const route = useRoute()
const registryManagementNumber = computed(() => String(route.params.caseId ?? ''))

// 아코디언 상태 관리
const { openMap, toggle } = useAccordionState()

// AdminSection 표시 여부 (데이터가 있을 때만 표시)
const showAdminSection = ref(false) // 초기에는 숨김 (AdminSection이 데이터 로드 후 알려줌)

function handleAdminLoaded(hasData: boolean) {
  showAdminSection.value = hasData
}
</script>

<style scoped lang="scss">
.detail-layout {
  display: grid;
  grid-template-columns: 200px 1fr;
  gap: 12px;
  align-items: start;
  background-color: #fff;
}

.sidebar {
  min-height: 1px;
}

.content {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.accordion {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
</style>
