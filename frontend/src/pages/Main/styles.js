import styled from 'styled-components';

export const Container = styled.div`
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;

  form {
    width: 300px;
    display: flex;
    flex-direction: column;

    input {
      height: 48px;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 16px;
      padding: 0 20px;
      margin-top: 30px;
    }

    button {
      height: 48px;
      background: #7159c1;
      border-radius: 4px;
      font-size: 16px;
      padding: 0 20px;
      margin-top: 10px;
      color: #fff;
      font-weight: bold;
      border: 0;
      cursor: pointer;

      &:hover {
        opacity: 0.8;
      }
    }
  }
`;