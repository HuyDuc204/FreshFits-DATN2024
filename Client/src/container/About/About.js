import React from "react";
import "./About.scss"; // Import your custom CSS file

const About = () => {
  return (
 <div>
<section className="section_all bg-light" id="about">
  <div className="container">
    <div className="row">
      <div className="col-lg-12">
        <div className="section_title_all text-center">
          <h3 className="font-weight-bold">Chào Mừng Bạn Đến Với <span className="text-custom">Shop Thời Trang Fresh Fits</span></h3>
          <p className="section_subtitle mx-auto text-muted">Shop Thời Trang Fresh Fits cung cấp các sản phẩm thời trang chất lượng cao với phong cách đa dạng. <br />Chúng tôi cam kết mang đến cho bạn những sản phẩm tốt nhất và dịch vụ khách hàng hoàn hảo.</p>
          <div className>
            <i className />
          </div>
        </div>
      </div>
    </div>
    <div className="row vertical_content_manage mt-5">
      <div className="col-lg-6">
        <div className="about_header_main mt-3">
          <div className="about_icon_box">
            <p className="text_custom font-weight-bold">Shop Thời Trang Fresh Fits - Sự Lựa Chọn Hoàn Hảo Cho Bạn</p>
          </div>
          <h4 className="about_heading text-capitalize font-weight-bold mt-4">Chúng tôi cung cấp các sản phẩm thời trang chất lượng nhất cho mọi phong cách.</h4>
          <p className="text-muted mt-3">Khác với những cửa hàng thời trang thông thường, Shop Thời Trang Fresh Fits mang đến cho bạn những sản phẩm được chọn lọc kỹ lưỡng, với chất liệu tốt và thiết kế hiện đại.</p>
          <p className="text-muted mt-3">Nhà thiết kế của chúng tôi luôn theo kịp xu hướng mới nhất và tạo ra các bộ sưu tập độc quyền, giúp bạn luôn nổi bật và tự tin trong mọi sự kiện.</p>
        </div>
      </div>
      <div className="col-lg-6">
        <div className="img_about mt-3">
          <img src="https://watermark.lovepik.com/photo/20211124/large/lovepik-fashion-womens-summer-shopping-image-picture_500961857.jpg" alt className="img-fluid mx-auto d-block" />
        </div>
      </div>
    </div>
    <div className="row mt-3">
      <div className="col-lg-4">
        <div className="about_content_box_all mt-3">
          <div className="about_detail text-center">
            <div className="about_icon">
              <i className="fas fa-pencil-alt" />
            </div>
            <h5 className="text-dark text-capitalize mt-3 font-weight-bold">Thiết Kế Sáng Tạo</h5>
            <p className="edu_desc mt-3 mb-0 text-muted">Chúng tôi cung cấp các thiết kế thời trang độc đáo, sáng tạo và phù hợp với xu hướng hiện đại.</p>
          </div>
        </div>
      </div>
      <div className="col-lg-4">
        <div className="about_content_box_all mt-3">
          <div className="about_detail text-center">
            <div className="about_icon">
              <i className="fab fa-angellist" />
            </div>
            <h5 className="text-dark text-capitalize mt-3 font-weight-bold">Chất Lượng Tốt Nhất</h5>
            <p className="edu_desc mb-0 mt-3 text-muted">Chúng tôi cam kết mang đến cho bạn những sản phẩm thời trang chất lượng nhất với dịch vụ khách hàng tận tâm.</p>
          </div>
        </div>
      </div>
      <div className="col-lg-4">
        <div className="about_content_box_all mt-3">
          <div className="about_detail text-center">
            <div className="about_icon">
              <i className="fas fa-paper-plane" />
            </div>
            <h5 className="text-dark text-capitalize mt-3 font-weight-bold">Nền Tảng Tuyệt Vời</h5>
            <p className="edu_desc mb-0 mt-3 text-muted">Trang web của chúng tôi dễ sử dụng, giúp bạn dễ dàng tìm kiếm và mua sắm các sản phẩm yêu thích.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

</div>

  );
};

export default About;
