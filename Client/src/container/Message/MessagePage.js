import React from 'react';

const MessagePage = () => {
  return (
    <div className="container mt-5">
      <div className="alert alert-warning text-center" role="alert">
        <h3 className="fw-bold" style={{ fontSize: "2rem" }}>
          Đang bảo trì
        </h3>
        <p className="mt-3">
          Trang này hiện đang bảo trì. Xin lỗi vì sự bất tiện này. Chúng tôi sẽ quay lại ngay sau khi công việc bảo trì hoàn thành.
        </p>
      </div>
    </div>
  );
}

export default MessagePage;
