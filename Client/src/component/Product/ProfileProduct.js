import React from "react";

function ProfileProduct(props) {
  let data = props.data;
  return (
    <div className="table-responsive">
      <table className="table table-bordered table-hover">
        <tbody>
          <tr>
            <td>
              <h5 className="font-weight-bold">Chiều rộng</h5>
            </td>
            <td>
              <h5>{data.width}</h5>
            </td>
          </tr>
          <tr>
            <td>
              <h5 className="font-weight-bold">Chiều dài</h5>
            </td>
            <td>
              <h5>{data.height}</h5>
            </td>
          </tr>
          <tr>
            <td>
              <h5 className="font-weight-bold">Khối lượng</h5>
            </td>
            <td>
              <h5>{data.weight}</h5>
            </td>
          </tr>
          <tr>
            <td>
              <h5 className="font-weight-bold">Kiểm tra chất lượng</h5>
            </td>
            <td>
              <h5>Có</h5>
            </td>
          </tr>
          <tr>
            <td>
              <h5 className="font-weight-bold">Bảo hành</h5>
            </td>
            <td>
              <h5>Có</h5>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default ProfileProduct;
