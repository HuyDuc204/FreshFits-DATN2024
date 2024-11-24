import React from 'react';

const Message = () => {
  return (
    <div className="alert alert-warning text-center" role="alert">
      <h3 className="fw-bold" style={{ fontSize: "1.8rem" }}>
        Đang bảo trì
      </h3>
      <p className="mt-3">
        Xin lỗi vì sự bất tiện này. Chúng tôi đang cập nhật hệ thống và sẽ quay lại sớm.
      </p>
    </div>
  );
}

export default Message;
