export const MESSAGES = {
  test: '전체 <span>{count}</span>건',

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
    my: '마이',
    ok: '확인',
    cancel: '취소',
    register: '등록',
    all: '전체',
    selectAll: '전체 선택',
    deselectAll: '전체 해제',
    add: '추가',
    save: '저장',
    registerInfo: '정보 등록',
    view: '보기',
    viewDetail: '상세보기',
    edit: '수정',
    download: '파일 다운로드',
    delete: '삭제',
    search: '검색',
    reset: '초기화'
  },

  header: {
    extend: '연장',
    logout: '로그아웃'
  },

  footer: {
    terms: '서비스 이용약관',
    privacy: '개인정보처리방침',
    copyright: 'COPYRIGHT ⓒ 2025 BANKCLEAR Inc. ALL RIGHTS RESERVED.'
  },

  estimate: {
    search: {
      registrationType: '등기유형 선택',
      lot: '필지 선택',
      requestDate: '등기의뢰일자 선택',
      receiptDate: '등기접수일자 선택',
      status: '진행상태 선택',
      writeStatus: '작성여부 선택',
      selectStatus: '선정여부 선택',
      integrated: '통합검색',
      value: {
        ownershipTransfer: '소유권이전',
        estimateProgress: '견적진행',
        estimateClosed: '견적마감',
        estimateSelected: '견적서 선정',
        selectionComplete: '선정 완료',
        requestCanceled: '요청 취소',
        writePending: '작성대기',
        writeComplete: '작성완료',
        estimateWithdrawn: '견적철회',
        selectPending: '선정대기',
        selected: '선정',
        notSelected: '미선정',
        placeholder: '부동산 및 신청번호 입력',
        noData: '조회 조건에 맞는 데이터가 존재하지 않습니다.',
        tabRequestStatus: '견적서 요청 현황',
        tabWriteStatus: '견적서 작성 현황',
        tabCaseStatus: '사건 수임 현황',
        totalCount: '전체 <span>{count}</span>건'
      }
    },
    table: {
      number: '번호',
      registrationNumber: '등기신청번호',
      tradeAmount: '매매 금액',
      propertyAddress: '부동산 주소',
      lot: '필지',
      requestDate: '등기의뢰일자',
      receiptDate: '등기접수일자',
      status: '진행상태',
      writeStatus: '작성여부',
      selectStatus: '선정여부'
    }
  }
} as const

// TypeScript 타입 자동 추론
export type Messages = typeof MESSAGES
