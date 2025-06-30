import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface LegalModalProps {
  type: 'terms' | 'privacy' | null;
  onClose: () => void;
}

const LegalModal: React.FC<LegalModalProps> = ({ type, onClose }) => {
  const termsContent = `
1. 서비스 이용약관

1.1 정의
본 약관에서 사용하는 용어의 정의는 다음과 같습니다:
- "서비스"라 함은 ITSCOPE PMO가 제공하는 프로젝트 관리 시스템을 의미합니다.
- "회원"이라 함은 본 약관에 동의하고 서비스를 이용하는 자를 의미합니다.

1.2 약관의 효력 및 변경
- 본 약관은 서비스를 이용하고자 하는 모든 회원에 대하여 그 효력을 발생합니다.
- 회사는 필요에 따라 본 약관을 변경할 수 있으며, 변경된 약관은 공지사항을 통해 안내됩니다.

1.3 서비스의 제공 및 변경
- 회사는 다음과 같은 서비스를 제공합니다:
  • 프로젝트 관리 도구
  • 팀 협업 기능
  • 일정 관리 시스템
  • 리포팅 및 분석 도구

1.4 회원의 의무
- 회원은 서비스 이용 시 관련 법령과 본 약관의 규정을 준수해야 합니다.
- 회원은 타인의 권리를 침해하거나 명예를 손상시키는 행위를 하여서는 안 됩니다.

1.5 서비스 이용의 제한
- 회사는 회원이 본 약관을 위반하거나 서비스의 정상적인 운영을 방해하는 경우 서비스 이용을 제한할 수 있습니다.

1.6 손해배상
- 회사는 무료 서비스와 관련하여 회원에게 발생한 손해에 대해서는 책임을 지지 않습니다.
- 다만, 회사의 고의 또는 중과실로 인한 손해의 경우에는 그러하지 아니합니다.

1.7 면책조항
- 회사는 천재지변 또는 이에 준하는 불가항력으로 인하여 서비스를 제공할 수 없는 경우에는 서비스 제공에 관한 책임이 면제됩니다.

1.8 준거법 및 재판관할
- 본 약관과 관련된 분쟁에 대해서는 대한민국 법을 적용하며, 관할법원은 서울중앙지방법원으로 합니다.
  `;

  const privacyContent = `
개인정보처리방침

1. 개인정보의 처리목적
ITSCOPE PMO는 다음의 목적을 위하여 개인정보를 처리합니다:
- 서비스 제공 및 계약의 이행
- 회원 관리 및 본인확인
- 고객 문의사항 응답 및 서비스 개선

2. 처리하는 개인정보의 항목
- 필수정보: 이메일 주소, 비밀번호, 이름
- 선택정보: 전화번호, 회사명, 부서명

3. 개인정보의 처리 및 보유기간
- 회원탈퇴 시까지 또는 개인정보 처리목적 달성 시까지
- 관련 법령에 따른 보존기간이 있는 경우 해당 기간까지

4. 개인정보 처리의 위탁
- 현재 개인정보 처리업무를 외부에 위탁하지 않습니다.
- 향후 위탁이 필요한 경우 사전에 공지하겠습니다.

5. 정보주체의 권리·의무 및 행사방법
회원은 개인정보 처리에 관하여 다음과 같은 권리를 가집니다:
- 개인정보 처리현황 통지요구권
- 개인정보 열람요구권
- 개인정보 정정·삭제요구권
- 개인정보 처리정지요구권

6. 개인정보의 안전성 확보조치
- 개인정보 취급 직원의 최소화 및 교육
- 개인정보에 대한 접근 통제 및 권한 제한
- 개인정보를 안전하게 저장·전송할 수 있는 암호화 기술 사용
- 개인정보에 대한 접근기록 보관 및 위·변조 방지

7. 개인정보보호책임자
- 성명: 개인정보보호담당자
- 연락처: privacy@itscope.com
- 전화번호: 02-1234-5678

8. 개인정보 처리방침의 변경
본 개인정보처리방침은 시행일로부터 적용되며, 법령 및 방침에 따른 변경내용의 추가, 삭제 및 정정이 있는 경우에는 변경사항의 시행 7일 전부터 공지사항을 통하여 고지할 것입니다.

시행일자: 2024년 1월 1일
  `;

  return (
    <Dialog open={type !== null} onOpenChange={() => onClose()}>
      <DialogContent className="w-11/12 sm:max-w-2xl max-h-[80vh] bg-zinc-900 text-white border-zinc-800">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            {type === 'terms' ? '이용약관' : '개인정보처리방침'}
          </DialogTitle>
        </DialogHeader>
        <div className="overflow-y-auto max-h-[60vh] pr-4">
          <pre className="whitespace-pre-wrap text-sm text-zinc-300 leading-relaxed font-noto">
            {type === 'terms' ? termsContent : privacyContent}
          </pre>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LegalModal;
