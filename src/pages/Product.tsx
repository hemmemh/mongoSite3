import React, { useContext, useEffect, useState } from 'react'
import Navbar from '../components/navBar/Navbar'
import { Swiper, SwiperSlide } from "swiper/react";

import Nav from '../components/UI/navigation/Navigation'
// Import Swiper styles
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/navigation";
import "swiper/css/thumbs";



// import required modules
import { FreeMode, Navigation, Thumbs } from "swiper";
import Button from '../components/UI/button/Button';
import Toggle from '../components/UI/toggle/Toggle';
import Footer from '../components/footer/Footer';
import Fold from '../components/UI/fold/Fold';
import FoldText from '../components/UI/foldText/FoldText';
import { getOneproduct,addRaiting } from '../https/productApi';
import { useParams } from 'react-router-dom';
import { API_URL } from '../utils/config';
import { addItemToBasket, getBasket, removeItemFromBasket } from '../https/basketApi';
import { Context } from '..';
import { addItemToCompare, getCompare, removeItemFromCompare } from '../https/compareApi';
import { addProductInLoves, getLoves, removeProductFromLoves } from '../https/lovesApi';
import { Rating } from '@mui/material';
import { Modal } from '../components/UI/modal/Modal';
import Input from '../components/UI/input/Input';
const Product = () => {
    const [thumbsSwiper, setThumbsSwiper] = useState<any>(null);
    const [toggleDesc, settoggleDesc] = useState(0)
    const [foldDescription, setfoldDescription] = useState<boolean>(false)
    const [foldText, setfoldText] = useState(false)
    const {id} = useParams()
    const [product, setproduct] = useState<any>({})
    const [productLoad, setproductLoad] = useState(false)
    const {user} = useContext(Context)
    const [inBasket, setinBasket] = useState(false)
    const [inCompare, setinCompare] = useState(false)
    const [inLoves, setinLoves] = useState(false)
    const [loves, setloves] = useState([])
    const [compare, setcompare] = useState<any>([])
    const [basket, setbasket] = useState([])
    const [raiting, setraiting] = useState(1)
    const [modal, setmodal] = useState(false)
    const [name, setname] = useState('')
    const [sername, setsername] = useState('')
    const [text, settext] = useState('')
    const [raitingModal, setraitingModal] = useState<any>(1)
    
    useEffect(() => {
        getOneproduct({id}).then(data=>{
            console.log(data);
            setproduct(data)
            setraiting((data.ratings.reduce((accumulator:any, currentValue:any)=>accumulator + currentValue.rate,0))/data.ratings.length)
            getBasket({id:user.user.id}).then(data=>{
                  console.log(data);
                  
                 if (  data?.basketItems.find((e:any)=>e.product?._id === id)) setinBasket(true)
                
                 setbasket(data.basketItems)
               
            })
            getCompare({id:user.user.compare}).then(data=>{
                console.log(data);
                if (data?.compareItems.find((e:any)=>e.product?._id === id)) {
                    setinCompare(true)
                    setcompare(data.compareItems)
                }
           
            })
            getLoves({id:user.user.loves}).then(data=>{
                setloves(data.lovesItems)
                if (data?.lovesItems.find((e:any)=>e.product?._id === id)) {
                    setinLoves(true)
                }
             })
        }
     
        
    ).then(()=>{
        setproductLoad(true)   
    })}, [])
    const addToBasket = ()=>{
        if (!inBasket) {
         
            addItemToBasket({basketId:user.user.basket,product:product._id,count:1}).then(data=>{
                console.log(data);
                setinBasket(true)
                setinBasket(true)
                
            })
        }else{
            removeItemFromBasket({id:basket.find((el:any)=>el.product._id === id),basketId:user.user.basket}).then(data=>{
                console.log(data);
                setinBasket(false)
               
            })
        }
       
    }

    const addToCompare = ()=>{
        if (!inCompare) {
         
            addItemToCompare({compareId:user.user.compare,product:id}).then(data=>{
               
                setinCompare(true)
            })
        }else{
            removeItemFromCompare({id:compare.find((el:any)=>el.product._id=== id)?._id,compareId:user.user.compare}).then(data=>{
                setinCompare(false)
            })
        }
      
    }
    const addToLoves = ()=>{
        if (!inLoves) {
        addProductInLoves({lovesId:user.user.loves,product:id}).then(data=>{
            setinLoves(true)
            
        })
    }else{
        removeProductFromLoves({id:loves.find((el:any)=>el.product._id=== id),lovesId:user.user.loves}).then(data=>{
            console.log(data);
            setinLoves(false)
            
        })
    }
    }
    const addRaitingToProduct = ()=>{
        addRaiting({user:user.user.id,rate:raitingModal,product:id,name,sername,text}).then(data=>{
            console.log(typeof data);
            "status" in data === false &&  window.location.reload();
   

        })
    }
  return (
 
   <div className="Product">
    <Navbar/>
    {productLoad && 
      <div className="Product__container">
      <Nav navigationClass='product _d'>Главная / Фотокамеры / Canon / 5D Mark IV body</Nav>
       <div className="Product__main main-product">
           <div className="main-product__left">
               <div className="main-product__gallery gallery-product">
                   <div className="gallery-product__actions">
                       <div onClick={addToCompare } className={inCompare ?"gallery-product__action active _icon-compare" :"gallery-product__action  _icon-compare"}></div>
                       <div onClick={addToLoves} className={inLoves ? "gallery-product__action active _icon-star" : "gallery-product__action _icon-star"}></div>
                   </div>
                   
                   <div className="gallery-product__slider">
                   <Swiper
       
       spaceBetween={10}
       //navigation={true}
       thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
       modules={[FreeMode, Navigation, Thumbs]}
       className="mySwiper2"
     >
       {JSON.parse(product.images).map((e:any)=>       
       <SwiperSlide>
          <div className="gallery-product__sliderItem">
          <img src={`${API_URL}/${product.name}/${e}`} alt=""/>
          </div>
       </SwiperSlide>
       ) }

   
     </Swiper>
                    </div>
                   <div className="gallery-product__thumbs">
                   <Swiper
       onSwiper={setThumbsSwiper}
       direction='vertical'
      
       slidesPerView={4}
       freeMode={true}
       watchSlidesProgress={true}
       modules={[FreeMode, Navigation, Thumbs]}
       className="mySwiper"
     >
        {JSON.parse(product.images).map((e:any)=>       
       <SwiperSlide>
           <div className="gallery-product__thumpItem">
           <img src={`${API_URL}/${product.name}/${e}`} alt=""/>
       </div>
       </SwiperSlide>
       ) }
    
    
     
      
     </Swiper>
                   </div>
               </div>
               <div className="main-product__tags tags-product">
                   <div className="tags-product__tag">Камера</div>
                   <div className="tags-product__tag  tags-product__tag_big">Объектив</div>
                   <div className="tags-product__tag">Фото</div>
                   <div className="tags-product__tag  tags-product__tag_big">Изображение</div>
                   <div className="tags-product__tag">Кэнон</div>
                   <div className="tags-product__tag  tags-product__tag_big">Стекло</div>
                   <div className="tags-product__tag">Аренда</div>
                   <div className="tags-product__tag  tags-product__tag_big">Цифровой</div>
               </div>
               
           </div>
           <div className="main-product__right">
               <Nav navigationClass='product _d2'>Главная / Фотокамеры / Canon / 5D Mark IV body</Nav>
               <div className="main-product__brand">{product.brand.name}</div>
               <div className="main-product__name">{product.name}</div>
               <div className="main-product__actions">
               <Button ripple={true} className='product-1 dr'>В наличии</Button>
               <Button onClick={addToBasket} ripple={true} className={inBasket ? 'slider2 _pr active _icon-cart': 'slider2 _pr _icon-cart'}>{inBasket ? 'В корзине' : 'В корзину'}</Button>
               </div>
               <div className="main-product__raiting">
                <Rating value={raiting} readOnly/>
               </div>
               
            
               <div className="main-product__description description-product">
                   <Toggle value={toggleDesc} change={settoggleDesc} toggleClass='product-toggle'>
                       
                       <div className="description-product__toggleItem">Описание</div>
                       <div className="description-product__toggleItem">Характеристики</div>
                   </Toggle>
                   <div className="description-product__body">
                       
                   <Fold foldClass={toggleDesc ===0 ?'product active': 'product'} slice={3} value={foldDescription} foldChange={setfoldDescription}>
                    {product.information.map((et:any)=>
                    <div className="description-product__description">{et.name}<span>{et.description}</span></div>
                    )}
                   </Fold>
                   <div className={toggleDesc === 1 ? "description-product__foldText active" : "description-product__foldText"}>
                   <FoldText foldClass={toggleDesc === 1  ?'product active': 'product'} value={foldText} foldChange={setfoldText} >
                       {product.description}
                   </FoldText>
                   </div>
                   
                   
                   </div>
                   
                   
                   <div  className="Fold__buttonCover">
                       {toggleDesc ===0 ?   
                       <Button onClick={()=>setfoldDescription((prev:any)=>!prev)} ripple={true} className='product-2 d'>{foldDescription === true ? 'Свернуть':'Развернуть' }</Button> 
                       :
                       <Button onClick={()=>setfoldText((prev:any)=>!prev)} ripple={true} className='product-2 d'>{foldDescription === true ? 'Свернуть':'Развернуть' }</Button>
                   }
                       
                
                   
       
   </div>
                   

               </div>
               
           </div>
           
       </div>
       <div className="Product__raitings raitings-product">
        <div className="raitings-product__button">
            <Button onClick={()=>setmodal(true)} className='basket g'>Написать отзыв</Button>
        </div>
        <div className="raitings-product__body">
            <Swiper
            spaceBetween={20}
            slidesPerView={1}
            freeMode={true}
            breakpoints={{
                500: {
                    slidesPerView: 2,
                    spaceBetween: 10,
                    
                  },
                700: {
                    slidesPerView: 3,
                    spaceBetween: 10,
                    
                  },
                991.98: {
                  slidesPerView: 4,
                  spaceBetween: 20,
                  
                },
      
              }}  
            >
                {product.ratings.map((el:any)=>
                 <SwiperSlide>
                 <div className="raitings-product__item-cover">
                    <div className="raitings-product__item item-raitings">
                         <div className="item-raitings__name">{el.name} {el.sername}</div>
                         <div className="item-raitings__raiting"><Rating readOnly value={el.rate}/></div>
                         <div className="item-raitings__text">{el.text}</div>
                    </div>
                 </div>
             </SwiperSlide>
             )}
               
               
            </Swiper>
           
            
        </div>
        
       </div>
       
   </div>
    }

     <Modal active={modal} setActive={setmodal} modalClass='raiting'>
        <div className="RaitingModal">
            <div className="RaitingModal__top">
                <Input value={name} change={setname} inputClass='registration gv' placeholder='Имя *'/>
                <Input value={sername} change={setsername} inputClass='registration gv' placeholder='Фамилия *'/>
            </div>
            <div className="RaitingModal__raiting"><Rating value={raitingModal}
  onChange={(event, newValue) => {
    setraitingModal(newValue);
  }}/></div>
            
            <div className="RaitingModal__text">
                <textarea value={text} onChange={(e)=>settext(e.target.value)} placeholder='отзыв' className='RaitingModal__textarea'>{text}</textarea>
            </div>
            <div className="RaitingModal__button">
            <Button  onClick={addRaitingToProduct} className='basket g'>Отправить</Button>
            </div>
            
        </div>
        
     </Modal>
 
    <Footer/>
   </div>
   
  )
}

export default Product