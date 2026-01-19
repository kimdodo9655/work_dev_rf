<template>
  <div class="calendar-container">
    <!-- 상단 컨트롤 영역 -->
    <div class="calendar-controls">
      <!-- 월간/주간 전환 탭 -->
      <div class="calendar-tabs">
        <button
          :class="['tab-button', { active: currentView === 'dayGridMonth' }]"
          @click="changeView('dayGridMonth')"
        >
          월간
        </button>
        <button
          :class="['tab-button', { active: currentView === 'dayGridWeek' }]"
          @click="changeView('dayGridWeek')"
        >
          주간
        </button>
      </div>

      <div class="right-controls">
        <!-- 표시 형태 선택 -->
        <div class="display-selector">
          <label for="event-display">표시 형태:</label>
          <select
            id="event-display"
            v-model="eventDisplayType"
            @change="changeEventDisplay"
            class="display-select"
          >
            <option value="block">블록 (Block)</option>
            <option value="list-item">리스트 (List)</option>
          </select>
        </div>

        <!-- 주말 표시/숨김 토글 -->
        <div class="weekend-toggle">
          <label class="toggle-label">
            <input
              type="checkbox"
              v-model="showWeekends"
              @change="toggleWeekends"
              class="toggle-checkbox"
            />
            <span class="toggle-slider"></span>
            <span class="toggle-text">주말 표시</span>
          </label>
        </div>
      </div>
    </div>

    <!-- FullCalendar -->
    <FullCalendar ref="calendarRef" :options="calendarOptions" />
  </div>
</template>

<script setup lang="ts">
import type { CalendarOptions, EventClickArg, EventInput } from '@fullcalendar/core'
import koLocale from '@fullcalendar/core/locales/ko'
import dayGridPlugin from '@fullcalendar/daygrid'
import type { DateClickArg } from '@fullcalendar/interaction'
import interactionPlugin from '@fullcalendar/interaction'
import FullCalendar from '@fullcalendar/vue3'
import { onMounted, ref } from 'vue'

const calendarRef = ref<InstanceType<typeof FullCalendar>>()
const currentView = ref<'dayGridMonth' | 'dayGridWeek'>('dayGridMonth')
const modalEvents = ref<EventInput[]>([])
const modalDate = ref('')
const eventDisplayType = ref<string>('list-item')
const showWeekends = ref<boolean>(true)

// 기본 샘플 이벤트 데이터
const baseEvents: EventInput[] = [
  {
    id: '1',
    title: '[BC2025062500001] 이전+설정',
    start: '2025-11-05',
    url: 'https://example.com/meeting1',
    backgroundColor: '#666666',
    extendedProps: {
      description: '등기',
      priority: 'high'
    }
  },
  {
    id: '2',
    title: '등기 00000000 박누구',
    start: '2025-11-05',
    url: 'https://example.com/meeting2',
    backgroundColor: '#3788d8',
    extendedProps: {
      priority: 'high'
    }
  },
  {
    id: '3',
    title: '등기 00000000 이누구',
    start: '2025-11-06',
    url: 'https://example.com/team-building',
    backgroundColor: '#3788d8',
    extendedProps: {
      priority: 'medium'
    }
  },
  {
    id: '4',
    title: '멋쟁이 토마토',
    start: '2025-11-07',
    url: 'https://example.com/code-review',
    backgroundColor: '#e6a23c',
    extendedProps: {
      priority: 'medium'
    }
  },
  {
    id: '5',
    title: '표고버섯',
    start: '2025-11-08',
    url: 'https://example.com/event1',
    backgroundColor: '#3788d8',
    extendedProps: {
      priority: 'low'
    }
  },
  {
    id: '6',
    title: '방토 노맛',
    start: '2025-11-08',
    url: 'https://example.com/event2',
    backgroundColor: '#409eff',
    extendedProps: {
      priority: 'high'
    }
  },
  {
    id: '7',
    title: '집가서 빨래',
    start: '2025-11-08',
    url: 'https://example.com/event3',
    backgroundColor: '#67c23a',
    extendedProps: {
      priority: 'low'
    }
  },
  {
    id: '8',
    title: '고양이',
    start: '2025-11-08',
    url: 'https://example.com/event4',
    backgroundColor: '#e6a23c',
    extendedProps: {
      priority: 'low'
    }
  },
  {
    id: '9',
    title: '오리너구리',
    start: '2025-11-08',
    url: 'https://example.com/event5',
    backgroundColor: '#f56c6c',
    extendedProps: {
      priority: 'low'
    }
  },
  {
    id: '10',
    title: '[BC2025062500001] 이전+설정 홀길동',
    start: '2026-01-05',
    url: 'https://example.com/meeting1',
    backgroundColor: '#666666',
    extendedProps: {
      description: '등기',
      priority: 'high'
    }
  },
  {
    id: '11',
    title: '[BC2025062500001] 이전+설정 김수한무',
    start: '2026-01-07',
    url: 'https://example.com/meeting1',
    backgroundColor: '#666666',
    extendedProps: {
      description: '등기',
      priority: 'high'
    }
  },
  {
    id: '12',
    title: 'BC2025062500001 이전+설정 홀길동',
    start: '2026-01-05',
    url: 'https://example.com/meeting1',
    backgroundColor: '#666666',
    extendedProps: {
      description: '등기',
      priority: 'high'
    }
  }
]

const events = ref<EventInput[]>([...baseEvents])

// 표시 형태에 따라 이벤트 데이터 변경
const updateEventsDisplay = (displayType: string) => {
  if (displayType === 'mixed') {
    // 혼합: 우선순위에 따라 다른 표시 형태
    events.value = baseEvents.map((event) => ({
      ...event,
      display: event.extendedProps?.priority === 'high' ? 'block' : 'list-item'
    }))
  } else {
    // 모든 이벤트에 동일한 표시 형태 적용
    events.value = baseEvents.map((event) => ({
      ...event,
      display: displayType
    }))
  }
}

// 뷰 전환
const changeView = (view: 'dayGridMonth' | 'dayGridWeek') => {
  currentView.value = view
  const calendarApi = calendarRef.value?.getApi()
  if (calendarApi) {
    calendarApi.changeView(view)
  }
}

// 표시 형태 변경
const changeEventDisplay = () => {
  updateEventsDisplay(eventDisplayType.value)
  const calendarApi = calendarRef.value?.getApi()
  if (calendarApi) {
    calendarApi.removeAllEvents()
    calendarApi.addEventSource(events.value)
  }
}

// 주말 표시/숨김 토글
const toggleWeekends = () => {
  const calendarApi = calendarRef.value?.getApi()
  if (calendarApi) {
    calendarApi.setOption('weekends', showWeekends.value)
  }
}

// +N more 링크 클릭 시 모달 열기
const handleMoreLinkClick = (info: any) => {
  modalEvents.value = info.allSegs.map((seg: any) => seg.event)
  modalDate.value = info.date.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
  return 'popover'
}

// 캘린더에서 이벤트 클릭
const handleEventClickFromCalendar = (info: EventClickArg) => {
  info.jsEvent.preventDefault()

  if (info.event.url) {
    window.open(info.event.url, '_blank')
  }
}

// 날짜 클릭
const handleDateClick = (info: DateClickArg) => {
  console.log('날짜 클릭:', info.dateStr)
}

// calendarOptions는 함수들이 모두 선언된 후에 정의
const calendarOptions = ref<CalendarOptions>({
  plugins: [dayGridPlugin, interactionPlugin],
  initialView: 'dayGridMonth',
  locale: koLocale,
  weekends: showWeekends.value, // 주말 표시 설정
  headerToolbar: {
    left: 'prev,next today',
    center: 'title',
    right: ''
  },
  events: events.value,
  editable: false,
  selectable: true,
  selectMirror: true,
  dayMaxEvents: 3,
  moreLinkClick: handleMoreLinkClick,
  eventClick: handleEventClickFromCalendar,
  dateClick: handleDateClick,
  height: 'auto',
  dayCellClassNames: (arg) => {
    const dayOfWeek = arg.date.getDay()
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      return ['weekend-cell']
    }
    return []
  },
  dayHeaderClassNames: (arg) => {
    const dayOfWeek = arg.date.getDay()
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      return ['weekend-header']
    }
    return []
  }
})

onMounted(() => {
  console.log('캘린더 마운트 완료')
  updateEventsDisplay(eventDisplayType.value)
})
</script>
