export default (payload, five) => {
    const css3DRender = five.plugins.css3DRender;
    // 销毁方法
    let destroy = null;
    let { container, dispose } = css3DRender.create3DDomContainer(payload.points);
    destroy = dispose;
    container.style.pointerEvents = 'all';
    if (payload.type == 1) {
        container.innerHTML = `<div style="border:none;width:100%;height:100%;background:url(${payload.src}) center no-repeat;background-size:cover;" ></div>`;
        container.style.pointerEvents = "none";
    }
    else {
        container.innerHTML = `<iframe src="${payload.src}" style="border:none;width:100%;height:100%" ></iframe>`;
    }
}