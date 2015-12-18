<?php

class Militree_EnhancedProductGallery_Block_Catalog_Product_View_Type_Configurable_Config extends Mage_Catalog_Block_Product_View_Type_Configurable
{
    public function getJsonImageConfig()
    {
        $associatedProductImages = [
            'products' => []
        ];

        $allowedProducts = $this->getAllowProducts();
        $productIndex = 0;
        foreach ($allowedProducts as $_product) {
            $id = $_product->getId();

            array_push($associatedProductImages['products'], [
                'id'     => $id,
                'swatch' => $_product->getColorConfigurable(),
                'images' => []
            ]);

            $product = Mage::getModel('catalog/product')->load($id);
            $imagesIndex = 0;
            $images = $product->getMediaGalleryImages();
                foreach($images as $image) {
                    array_push($associatedProductImages['products'][$productIndex]['images'], [
                        'img_id' => $imagesIndex,
                        'src'    => $image->getUrl(),
                        'zoom'    => $image->getUrl(),
                    ]);

                    $imagesIndex++;
                }
            $productIndex++;
        }
        return json_encode($associatedProductImages);
    }
}