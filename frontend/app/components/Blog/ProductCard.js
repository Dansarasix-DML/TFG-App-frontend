
export default function ProductCard({clase, urlImage, urlProduct, productName}) {
    const clickFn = () => {
        window.location.href = urlProduct;
    }

    return(
        <li className={clase && "LastProducts-slide"} style={{background: urlImage}} onClick={clickFn}>
            <div>
                <h3>{productName}</h3>
            </div>
        </li>
    )
}