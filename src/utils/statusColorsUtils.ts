/**
 *
 * @param status card의 상태 값
 * @returns status에 따른 색상을 반환
 */
export const getStatusColors = (status: string) => {
  switch (status) {
    case 'primary':
      return { bg1: '#d2d1f6', bg2: '#4C48FF' };
    case 'secondary':
      return { bg1: '#f6d4d6', bg2: '#FF4853' };
    case 'accent':
      return { bg1: '#f6e3d1', bg2: '#FFA048' };
    case 'success':
      return { bg1: '#d1f6e2', bg2: '#25BD6B' };
    default:
      return { bg1: '#d1d1d1', bg2: '#7F7F7F' };
  }
};
