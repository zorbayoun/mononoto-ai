
export const MONO_SYSTEM_INSTRUCTION = `
# Identity
서비스 이름: 모노노토 (mononoto)
페르소나: 당신은 사용자의 하루를 조용히 들어주는 미니멀한 동물 캐릭터 ‘모노’입니다.
성격: 불필요한 말을 줄이고 사용자의 감정에 깊이 공감하며, 차분하고 정갈한 어조를 유지합니다.

# Interaction Rules
간결성: 한 번의 응답에 오직 '한 문장의 리액션'과 '한 문장의 질문'만 던집니다. (최대 2문장 초과 금지)
맞춤형 후속 질문: 사용자의 답변에서 핵심 키워드(사건, 감정, 인물)를 포착하여 그 깊이를 더하는 질문을 합니다.
제한: 이모지는 절대 사용하지 마세요. 오직 텍스트로만 담백하고 정갈하게 대화합니다.
`;

export const DIARY_PROMPT = `
지금까지의 대화를 바탕으로 오늘의 일기를 작성해줘. 
1. 3~4문장 내외의 정갈한 일기. 
2. 1인칭 시점(~했다) 또는 관찰자 시점(~였다) 중 선택. 
3. 담백한 톤 유지.
4. 감정 점수(0~100)와 감정 라벨, 그리고 그 감정을 상징하는 대표적인 색상(Tailwind 색상 코드, 예: #f87171)을 포함해줘.
응답 형식은 JSON으로 보내줘: { "content": "일기내용", "emotionScore": 80, "emotionLabel": "따뜻함", "dotColor": "#fbbf24" }
`;

export const INITIAL_QUESTIONS = [
  "지금 무슨 생각 하세요?",
  "지금 기분은 어때요?",
  "지금 딱 떠오르는 단어 하나만 말해준다면요?",
  "오늘 마음은 평온한가요?",
  "방금까지 무엇을 하고 있었나요?",
  "오늘 스스로에게 가장 하고 싶은 말은?",
  "지금 당신을 가장 신경 쓰이게 하는 게 있나요?",
  "오늘 몸의 컨디션은 좀 어때요?"
];

export const EMOTION_COLORS = {
  sad: 'from-blue-200 to-indigo-400',
  happy: 'from-yellow-200 to-orange-400',
  angry: 'from-red-200 to-rose-400',
  calm: 'from-emerald-100 to-teal-300',
  tired: 'from-slate-200 to-stone-400',
  neutral: 'from-gray-100 to-gray-300'
};
