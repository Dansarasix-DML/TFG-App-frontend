'use client';
import ProductIndex from '../../components/Shop/ProductIndex';

export default function productPage({params}) {
    return (
        <ProductIndex productSlug={params.productslug} />
    )
}