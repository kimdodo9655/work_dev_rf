/**
 * 문서 경로: `@/src/constants/messages.ts`
 * 문서 제목: 상수 모듈: messages
 */

export const MESSAGES = {
  pageTitle: {
    error: {
      404: '잘못된 페이지 접근',
      macOs: 'Mac OS 접속 오류',
      mobile: '모바일 접속 오류'
    },
    shared: {
      viewer: '웹뷰어',
      deviceInfo: '등록 단말기 입력 정보 확인',
      notice: '공지사항',
      noticeDetail: '공지사항 상세'
    },
    auth: {
      login: '로그인',
      signup: '회원가입',
      install: '프로그램 설치',
      autoLogout: '자동 로그아웃',
      passwordSetup: '비밀번호 설정',
      blocked: {
        mac: '사이트 접속 차단',
        email: '사이트 접속 차단',
        user: '사이트 접속 차단'
      }
    },
    main: {
      bankSelect: '금융기관 선택',
      bankChange: '금융기관 변경',
      dashboard: '나의 사건 정보'
    },
    my: {
      organization: '기관/지점 정보 관리',
      organizationDetail: '기관/지점 등록 정보',
      users: '사용자 정보 관리',
      userDetail: '사용자 등록 정보',
      profile: '내 정보 관리'
    },
    estimate: {
      list: '등기 견적 관리',
      createDetail: '견적서 작성/제출 상세',
      confirmDetail: '견적서 확인/철회 상세'
    },
    registration: {
      caseStatus: '등기 진행 현황',
      caseDetail: '등기 진행 상세',
      schedule: '등기 일정 관리'
    }
  },

  common: {
    home: 'HOME',
    my: '마이'
  },

  commonButtons: {
    previous: '이전',
    next: '다음',
    login: '로그인',
    logout: '로그아웃',
    cancel: '취소',
    extend: '연장',
    confirm: '확인'
  }
} as const

// TypeScript 타입 자동 추론
export type Messages = typeof MESSAGES
