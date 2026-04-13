// Mock data for premium features prototype

export interface EmotionPoint {
  date: string;
  label: string;
  score: number; // 1-10, 1=very negative, 10=very positive
  summary: string;
  quote: string;
  topic: string;
}

export const emotionTimeline: EmotionPoint[] = [
  {
    date: "01/03",
    label: "Lo âu",
    score: 3,
    summary: "Bạn chia sẻ về áp lực công việc và cảm giác không đủ năng lực. Socrates nhận thấy bạn có xu hướng so sánh bản thân với đồng nghiệp.",
    quote: "Tôi cứ nghĩ người ta sẽ phát hiện ra tôi thật ra không biết gì cả...",
    topic: "Công việc",
  },
  {
    date: "05/03",
    label: "Buồn bã",
    score: 2,
    summary: "Cuộc trò chuyện xoay quanh mối quan hệ gia đình. Bạn cảm thấy không được lắng nghe bởi người thân.",
    quote: "Mỗi lần tôi cố nói, họ lại chuyển sang chuyện khác...",
    topic: "Gia đình",
  },
  {
    date: "08/03",
    label: "Nhẹ nhõm",
    score: 6,
    summary: "Bạn nhận ra rằng nhu cầu được công nhận đang chi phối nhiều quyết định. Đây là bước đầu quan trọng.",
    quote: "Có lẽ tôi làm điều đó không phải vì tôi muốn, mà vì tôi sợ người ta nghĩ xấu về mình.",
    topic: "Tự nhận thức",
  },
  {
    date: "15/03",
    label: "Giận dữ",
    score: 3,
    summary: "Bạn bày tỏ sự thất vọng với bản thân vì lặp lại cùng một sai lầm. Socrates giúp bạn thấy rằng sự lặp lại cũng là một dạng thông tin.",
    quote: "Tại sao tôi lại để mình rơi vào tình huống này lần nữa?",
    topic: "Tự phản tư",
  },
  {
    date: "20/03",
    label: "Bất an",
    score: 4,
    summary: "Bạn lo lắng về một dự án quan trọng sắp đến hạn. Cảm giác mất kiểm soát khiến bạn khó ngủ.",
    quote: "Nếu mọi thứ không diễn ra theo kế hoạch thì sao?",
    topic: "Công việc",
  },
  {
    date: "25/03",
    label: "Hy vọng",
    score: 7,
    summary: "Sau khi nhìn lại hành trình, bạn thấy mình đã thay đổi nhiều hơn mình tưởng. Một khoảnh khắc tự hào nhỏ nhưng quan trọng.",
    quote: "Có lẽ tôi đã quá khắt khe với bản thân...",
    topic: "Tự nhận thức",
  },
  {
    date: "28/03",
    label: "Lo âu",
    score: 3,
    summary: "Pattern quen thuộc quay lại: bạn bắt đầu nghi ngờ bản thân trước một cơ hội mới.",
    quote: "Liệu mình có xứng đáng với vị trí đó không?",
    topic: "Công việc",
  },
  {
    date: "02/04",
    label: "Bình yên",
    score: 8,
    summary: "Bạn tập trung vào hiện tại thay vì lo lắng về tương lai. Cuộc trò chuyện kết thúc trong sự nhẹ nhàng.",
    quote: "Hôm nay tôi chỉ muốn được là chính mình, không cần chứng minh gì cả.",
    topic: "Tự chấp nhận",
  },
  {
    date: "04/04",
    label: "Suy tư",
    score: 5,
    summary: "Bạn đặt câu hỏi về ý nghĩa công việc và liệu mình có đang đi đúng hướng.",
    quote: "Tôi thành công theo tiêu chuẩn của ai?",
    topic: "Công việc",
  },
];

export interface InnerCharacter {
  id: string;
  name: string;
  description: string;
  icon: string; // emoji or symbol
  color: string; // tailwind color token
  appearances: number;
  firstSeen: string;
  lastSeen: string;
  quote: string;
  socratesNote: string;
  sessionTopic: string;
}

export const innerCharacters: InnerCharacter[] = [
  {
    id: "impostor",
    name: "Kẻ mạo danh",
    description: "Nghi ngờ năng lực bản thân trước khi bắt đầu",
    icon: "◈",
    color: "gold",
    appearances: 5,
    firstSeen: "01/03/2026",
    lastSeen: "04/04/2026",
    quote: "Tôi cứ nghĩ người ta sẽ phát hiện ra tôi thật ra không biết gì cả...",
    socratesNote: "Bạn thường bắt đầu bằng việc liệt kê lý do mình không đủ giỏi, trước khi thật sự thử.",
    sessionTopic: "công việc",
  },
  {
    id: "seeker",
    name: "Người cần được nhìn nhận",
    description: "Tìm kiếm sự công nhận từ bên ngoài để cảm thấy có giá trị",
    icon: "◉",
    color: "accent",
    appearances: 4,
    firstSeen: "08/03/2026",
    lastSeen: "28/03/2026",
    quote: "Có lẽ tôi làm điều đó không phải vì tôi muốn, mà vì tôi sợ người ta nghĩ xấu về mình.",
    socratesNote: "Giá trị bản thân của bạn đang được đo bằng phản ứng của người khác, thay vì bằng niềm tin của chính bạn.",
    sessionTopic: "mối quan hệ",
  },
  {
    id: "controller",
    name: "Người kiểm soát",
    description: "Lo lắng khi mọi thứ không theo kế hoạch",
    icon: "◇",
    color: "stone",
    appearances: 2,
    firstSeen: "20/03/2026",
    lastSeen: "25/03/2026",
    quote: "Nếu mọi thứ không diễn ra theo kế hoạch thì sao?",
    socratesNote: "Bạn đánh đồng sự kiểm soát với sự an toàn. Nhưng cuộc sống hiếm khi cho phép điều đó.",
    sessionTopic: "công việc",
  },
  {
    id: "avoider",
    name: "Người tránh né",
    description: "Trì hoãn khi đối mặt với quyết định khó",
    icon: "○",
    color: "sage",
    appearances: 1,
    firstSeen: "02/04/2026",
    lastSeen: "02/04/2026",
    quote: "Để mai tính cũng được...",
    socratesNote: "Sự trì hoãn không phải lười biếng — nó là cách bạn bảo vệ mình khỏi nỗi sợ thất bại.",
    sessionTopic: "quyết định",
  },
];

export interface CharacterLink {
  from: string;
  to: string;
  strength: "strong" | "medium" | "weak";
  insight: string;
}

export const characterLinks: CharacterLink[] = [
  {
    from: "impostor",
    to: "seeker",
    strength: "strong",
    insight: "Khi 'Kẻ mạo danh' hoạt động mạnh, bạn thường tìm đến sự công nhận bên ngoài để bù đắp. Hai nhân vật này tạo thành một vòng lặp: càng nghi ngờ bản thân → càng cần người khác xác nhận → càng phụ thuộc → càng nghi ngờ.",
  },
  {
    from: "impostor",
    to: "controller",
    strength: "medium",
    insight: "Để đối phó với cảm giác 'không đủ giỏi', bạn cố kiểm soát mọi thứ — như thể nếu mọi thứ hoàn hảo, không ai có thể phê phán bạn.",
  },
  {
    from: "controller",
    to: "avoider",
    strength: "weak",
    insight: "Khi nhận ra mình không thể kiểm soát được, bạn chuyển sang tránh né — đây là phản ứng phòng vệ tự nhiên.",
  },
];
