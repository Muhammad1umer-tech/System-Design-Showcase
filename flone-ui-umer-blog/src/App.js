import { Suspense, lazy, useState } from "react";
import ScrollToTop from "./helpers/scroll-top";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Success from "./pages/other/Success";
import VerifyOtp from "./pages/other/Verify_Otp";
import VerifyEmail from "./components/header/VerifyEmail";
import {useEffect} from "react"
import {initWebSocket} from '../src/custom_axios/Socket'
import { useDispatch } from "react-redux";
import i18n from "./i18n";
import {setCurrency} from '../src/store/slices/currency-slice'
import GoogleTranslate from "./GoogleTranslator";

// home pages
const HomeFashion = lazy(() => import("./pages/home/HomeFashion"));
const HomeFashionTwo = lazy(() => import("./pages/home/HomeFashionTwo"));
const HomeFashionThree = lazy(() => import("./pages/home/HomeFashionThree"));
const HomeFashionFour = lazy(() => import("./pages/home/HomeFashionFour"));
const HomeFashionFive = lazy(() => import("./pages/home/HomeFashionFive"));
const HomeFashionSix = lazy(() => import("./pages/home/HomeFashionSix"));
const HomeFashionSeven = lazy(() => import("./pages/home/HomeFashionSeven"));
const HomeFashionEight = lazy(() => import("./pages/home/HomeFashionEight"));
const HomeKidsFashion = lazy(() => import("./pages/home/HomeKidsFashion"));
const HomeCosmetics = lazy(() => import("./pages/home/HomeCosmetics"));
const HomeFurniture = lazy(() => import("./pages/home/HomeFurniture"));
const HomeFurnitureTwo = lazy(() => import("./pages/home/HomeFurnitureTwo"));
const HomeFurnitureThree = lazy(() =>
  import("./pages/home/HomeFurnitureThree")
);
const HomeFurnitureFour = lazy(() => import("./pages/home/HomeFurnitureFour"));
const HomeFurnitureFive = lazy(() => import("./pages/home/HomeFurnitureFive"));
const HomeFurnitureSix = lazy(() => import("./pages/home/HomeFurnitureSix"));
const HomeFurnitureSeven = lazy(() =>
  import("./pages/home/HomeFurnitureSeven")
);
const HomeElectronics = lazy(() => import("./pages/home/HomeElectronics"));
const HomeElectronicsTwo = lazy(() =>
  import("./pages/home/HomeElectronicsTwo")
);
const HomeElectronicsThree = lazy(() =>
  import("./pages/home/HomeElectronicsThree")
);
const HomeBookStore = lazy(() => import("./pages/home/HomeBookStore"));
const HomeBookStoreTwo = lazy(() => import("./pages/home/HomeBookStoreTwo"));
const HomePlants = lazy(() => import("./pages/home/HomePlants"));
const HomeFlowerShop = lazy(() => import("./pages/home/HomeFlowerShop"));
const HomeFlowerShopTwo = lazy(() => import("./pages/home/HomeFlowerShopTwo"));
const HomeOrganicFood = lazy(() => import("./pages/home/HomeOrganicFood"));
const HomeOrganicFoodTwo = lazy(() =>
  import("./pages/home/HomeOrganicFoodTwo")
);
const HomeOnepageScroll = lazy(() => import("./pages/home/HomeOnepageScroll"));
const HomeGridBanner = lazy(() => import("./pages/home/HomeGridBanner"));
const HomeAutoParts = lazy(() => import("./pages/home/HomeAutoParts"));
const HomeCakeShop = lazy(() => import("./pages/home/HomeCakeShop"));
const HomeHandmade = lazy(() => import("./pages/home/HomeHandmade"));
const HomePetFood = lazy(() => import("./pages/home/HomePetFood"));
const HomeMedicalEquipment = lazy(() =>
  import("./pages/home/HomeMedicalEquipment")
);
const HomeChristmas = lazy(() => import("./pages/home/HomeChristmas"));
const HomeBlackFriday = lazy(() => import("./pages/home/HomeBlackFriday"));
const HomeBlackFridayTwo = lazy(() =>
  import("./pages/home/HomeBlackFridayTwo")
);
const HomeValentinesDay = lazy(() => import("./pages/home/HomeValentinesDay"));

// shop pages
const ShopGridStandard = lazy(() => import("./pages/shop/ShopGridStandard"));
const ShopGridFilter = lazy(() => import("./pages/shop/ShopGridFilter"));
const ShopGridTwoColumn = lazy(() => import("./pages/shop/ShopGridTwoColumn"));
const ShopGridNoSidebar = lazy(() => import("./pages/shop/ShopGridNoSidebar"));
const ShopGridFullWidth = lazy(() => import("./pages/shop/ShopGridFullWidth"));
const ShopGridRightSidebar = lazy(() =>
  import("./pages/shop/ShopGridRightSidebar")
);
const ShopListStandard = lazy(() => import("./pages/shop/ShopListStandard"));
const ShopListFullWidth = lazy(() => import("./pages/shop/ShopListFullWidth"));
const ShopListTwoColumn = lazy(() => import("./pages/shop/ShopListTwoColumn"));

// product pages
const Product = lazy(() => import("./pages/shop-product/Product"));
const ProductTabLeft = lazy(() =>
  import("./pages/shop-product/ProductTabLeft")
);
const ProductTabRight = lazy(() =>
  import("./pages/shop-product/ProductTabRight")
);
const ProductSticky = lazy(() => import("./pages/shop-product/ProductSticky"));
const ProductSlider = lazy(() => import("./pages/shop-product/ProductSlider"));
const ProductFixedImage = lazy(() =>
  import("./pages/shop-product/ProductFixedImage")
);

// blog pages
const BlogStandardOverall = lazy(() => import("./pages/blog/BlogStandardOverall"));
const BlogStandard = lazy(() => import("./pages/blog/BlogStandard"));
const BlogNoSidebar = lazy(() => import("./pages/blog/BlogNoSidebar"));
const BlogRightSidebar = lazy(() => import("./pages/blog/BlogRightSidebar"));
const BlogDetailsStandard = lazy(() =>
  import("./pages/blog/BlogDetailsStandard")
);

// other pages
const About = lazy(() => import("./pages/other/About"));
const PremiumMember = lazy(() => import("./pages/other/PremiumMember"));
const Contact = lazy(() => import("./pages/other/Contact"));
const MyAccount = lazy(() => import("./pages/other/MyAccount"));
const LoginRegister = lazy(() => import("./pages/other/LoginRegister"));

const Cart = lazy(() => import("./pages/other/Cart"));
const Wishlist = lazy(() => import("./pages/other/Wishlist"));
const Notification = lazy(() => import("./pages/other/Notification"));
const Compare = lazy(() => import("./pages/other/Compare"));
const Checkout = lazy(() => import("./pages/other/Checkout"));

const NotFound = lazy(() => import("./pages/other/NotFound"));
const success = lazy(() => import("./pages/other/Success"));

const verify_Otp = lazy(() => import("./pages/other/Verify_Otp"))
const Test = lazy(() => import("./pages/other/Test"))


const App = () => {
 useEffect(()=>{
  var lan = navigator.language
  i18n.changeLanguage(lan)

  localStorage.setItem('i18nextLng', lan)
  if (lan === "de") {
      dispatch(setCurrency("GBP"));
      console.log("currency_set")
  }
  else if (lan === "es") {
      dispatch(setCurrency("EUR"));
  }
  else {
    dispatch(setCurrency("USD"));
  }

 },[])

//  Google tag (gtag.js)
// Place this code in your JavaScript file

  // Load Google Tag Manager script asynchronously
  var gtagScript = document.createElement('script');
  gtagScript.async = true;
  gtagScript.src = 'https://www.googletagmanager.com/gtag/js?id=G-MBY1F5195Z';
  document.head.appendChild(gtagScript);

  // Initialize dataLayer if it's not already defined
  window.dataLayer = window.dataLayer || [];

  // Define the gtag function to push arguments to dataLayer
  function gtag() {
    window.dataLayer.push(arguments);
  }

  // Call gtag function to set up Google Analytics
  gtag('js', new Date());
  gtag('config', 'G-MBY1F5195Z');

  const dispatch = useDispatch()
  if (localStorage.getItem("access")) {
    initWebSocket(dispatch, true);
  }

  return (
      <Router>
        <ScrollToTop>
        <GoogleTranslate/>
          <Suspense
            fallback={
              <div className="flone-preloader-wrapper">
                <div className="flone-preloader">
                  <span></span>
                  <span></span>
                </div>
              </div>
            }
          >
            <Routes>
              <Route
                path={process.env.PUBLIC_URL + "/"}
                element={<HomeFashion />}
              />

            <Route
                path={process.env.PUBLIC_URL + "/test"}
                element={<Test/>}
              />

              <Route
                path={process.env.PUBLIC_URL + "/success"}
                element={<Success/>}
              />

              {/* Homepages */}
              <Route
                path={process.env.PUBLIC_URL + "/home-fashion"}
                element={<HomeFashion/>}
              />
              <Route
                path={process.env.PUBLIC_URL + "/home-fashion-two"}
                element={<HomeFashionTwo/>}
              />
              <Route
                path={process.env.PUBLIC_URL + "/home-fashion-three"}
                element={<HomeFashionThree/>}
              />
              <Route
                path={process.env.PUBLIC_URL + "/home-fashion-four"}
                element={<HomeFashionFour/>}
              />
              <Route
                path={process.env.PUBLIC_URL + "/home-fashion-five"}
                element={<HomeFashionFive/>}
              />
              <Route
                path={process.env.PUBLIC_URL + "/home-fashion-six"}
                element={<HomeFashionSix/>}
              />
              <Route
                path={process.env.PUBLIC_URL + "/home-fashion-seven"}
                element={<HomeFashionSeven/>}
              />
              <Route
                path={process.env.PUBLIC_URL + "/home-fashion-eight"}
                element={<HomeFashionEight/>}
              />
              <Route
                path={process.env.PUBLIC_URL + "/home-kids-fashion"}
                element={<HomeKidsFashion/>}
              />
               <Route
                path={process.env.PUBLIC_URL + "/verify-otp"}
                element={<VerifyOtp/>}
              />
              <Route
                path={process.env.PUBLIC_URL + "/verify-email"}
                element={<VerifyEmail/>}
              />
              <Route
                path={process.env.PUBLIC_URL + "/home-cosmetics"}
                element={<HomeCosmetics/>}
              />
              <Route
                path={process.env.PUBLIC_URL + "/home-furniture"}
                element={<HomeFurniture/>}
              />
              <Route
                path={process.env.PUBLIC_URL + "/home-furniture-two"}
                element={<HomeFurnitureTwo/>}
              />
              <Route
                path={process.env.PUBLIC_URL + "/home-furniture-three"}
                element={<HomeFurnitureThree/>}
              />
              <Route
                path={process.env.PUBLIC_URL + "/home-furniture-four"}
                element={<HomeFurnitureFour/>}
              />
              <Route
                path={process.env.PUBLIC_URL + "/home-furniture-five"}
                element={<HomeFurnitureFive/>}
              />
              <Route
                path={process.env.PUBLIC_URL + "/home-furniture-six"}
                element={<HomeFurnitureSix/>}
              />
              <Route
                path={process.env.PUBLIC_URL + "/home-furniture-seven"}
                element={<HomeFurnitureSeven/>}
              />
              <Route
                path={process.env.PUBLIC_URL + "/home-electronics"}
                element={<HomeElectronics/>}
              />
              <Route
                path={process.env.PUBLIC_URL + "/home-electronics-two"}
                element={<HomeElectronicsTwo/>}
              />
              <Route
                path={process.env.PUBLIC_URL + "/home-electronics-three"}
                element={<HomeElectronicsThree/>}
              />
              <Route
                path={process.env.PUBLIC_URL + "/home-book-store"}
                element={<HomeBookStore/>}
              />
              <Route
                path={process.env.PUBLIC_URL + "/home-book-store-two"}
                element={<HomeBookStoreTwo/>}
              />
              <Route
                path={process.env.PUBLIC_URL + "/home-plants"}
                element={<HomePlants/>}
              />
              <Route
                path={process.env.PUBLIC_URL + "/home-flower-shop"}
                element={<HomeFlowerShop/>}
              />
              <Route
                path={process.env.PUBLIC_URL + "/home-flower-shop-two"}
                element={<HomeFlowerShopTwo/>}
              />
              <Route
                path={process.env.PUBLIC_URL + "/home-organic-food"}
                element={<HomeOrganicFood/>}
              />
              <Route
                path={process.env.PUBLIC_URL + "/home-organic-food-two"}
                element={<HomeOrganicFoodTwo/>}
              />
              <Route
                path={process.env.PUBLIC_URL + "/home-onepage-scroll"}
                element={<HomeOnepageScroll/>}
              />
              <Route
                path={process.env.PUBLIC_URL + "/home-grid-banner"}
                element={<HomeGridBanner/>}
              />
              <Route
                path={process.env.PUBLIC_URL + "/home-auto-parts"}
                element={<HomeAutoParts/>}
              />
              <Route
                path={process.env.PUBLIC_URL + "/home-cake-shop"}
                element={<HomeCakeShop/>}
              />
              <Route
                path={process.env.PUBLIC_URL + "/home-handmade"}
                element={<HomeHandmade/>}
              />
              <Route
                path={process.env.PUBLIC_URL + "/home-pet-food"}
                element={<HomePetFood/>}
              />
              <Route
                path={process.env.PUBLIC_URL + "/home-medical-equipment"}
                element={<HomeMedicalEquipment/>}
              />
              <Route
                path={process.env.PUBLIC_URL + "/home-christmas"}
                element={<HomeChristmas/>}
              />
              <Route
                path={process.env.PUBLIC_URL + "/home-black-friday"}
                element={<HomeBlackFriday/>}
              />
              <Route
                path={process.env.PUBLIC_URL + "/home-black-friday-two"}
                element={<HomeBlackFridayTwo/>}
              />
              <Route
                path={process.env.PUBLIC_URL + "/home-valentines-day"}
                element={<HomeValentinesDay/>}
              />

              {/* Shop pages */}
              <Route
                path={process.env.PUBLIC_URL + "/shop-grid-standard"}
                element={<ShopGridStandard/>}
              />
              <Route
                path={process.env.PUBLIC_URL + "/shop-grid-filter"}
                element={<ShopGridFilter/>}
              />
              <Route
                path={process.env.PUBLIC_URL + "/shop-grid-two-column"}
                element={<ShopGridTwoColumn/>}
              />
              <Route
                path={process.env.PUBLIC_URL + "/shop-grid-no-sidebar"}
                element={<ShopGridNoSidebar/>}
              />
              <Route
                path={process.env.PUBLIC_URL + "/shop-grid-full-width"}
                element={<ShopGridFullWidth/>}
              />
              <Route
                path={process.env.PUBLIC_URL + "/shop-grid-right-sidebar"}
                element={<ShopGridRightSidebar/>}
              />
              <Route
                path={process.env.PUBLIC_URL + "/shop-list-standard"}
                element={<ShopListStandard/>}
              />
              <Route
                path={process.env.PUBLIC_URL + "/shop-list-full-width"}
                element={<ShopListFullWidth/>}
              />
              <Route
                path={process.env.PUBLIC_URL + "/shop-list-two-column"}
                element={<ShopListTwoColumn/>}
              />

              {/* Shop product pages */}
              <Route
                path={process.env.PUBLIC_URL + "/product/:id"}
                element={<Product />}
              />
              <Route
                path={process.env.PUBLIC_URL + "/product-tab-left/:id"}
                element={<ProductTabLeft/>}
              />
              <Route
                path={process.env.PUBLIC_URL + "/product-tab-right/:id"}
                element={<ProductTabRight/>}
              />
              <Route
                path={process.env.PUBLIC_URL + "/product-sticky/:id"}
                element={<ProductSticky/>}
              />
              <Route
                path={process.env.PUBLIC_URL + "/product-slider/:id"}
                element={<ProductSlider/>}
              />
              <Route
                path={process.env.PUBLIC_URL + "/product-fixed-image/:id"}
                element={<ProductFixedImage/>}
              />

              {/* Blog pages */}
              <Route
                path={process.env.PUBLIC_URL + "/blog-standard-overall"}
                element={<BlogStandardOverall/>}
              />

              <Route
                path={process.env.PUBLIC_URL + "/blog-standard"}
                element={<BlogStandard/>}
              />
              <Route
                path={process.env.PUBLIC_URL + "/blog-no-sidebar"}
                element={<BlogNoSidebar/>}
              />

              <Route
                path={process.env.PUBLIC_URL + "/blog-right-sidebar"}
                element={<BlogRightSidebar/>}
              />
              <Route
                path={process.env.PUBLIC_URL + "/blog-details-standard/:blogid"}
                element={<BlogDetailsStandard/>}
              />

              {/* Other pages */}
              <Route
                path={process.env.PUBLIC_URL + "/about"}
                element={<About/>}
              />
              <Route
                path={process.env.PUBLIC_URL + "/contact"}
                element={<Contact/>}
              />
              <Route
                path={process.env.PUBLIC_URL + "/my-account"}
                element={<MyAccount/>}
              />
              <Route
                path={process.env.PUBLIC_URL + "/login-register"}
                element={<LoginRegister />}
              />

              <Route
                path={process.env.PUBLIC_URL + "/cart"}
                element={<Cart/>}
              />
              <Route
                path={process.env.PUBLIC_URL + "/wishlist"}
                element={<Wishlist/>}
              />

                <Route
                path={process.env.PUBLIC_URL + "/notification"}
                element={<Notification/>}
              />


              <Route
                path={process.env.PUBLIC_URL + "/compare"}
                element={<Compare/>}
              />
              <Route
                path={process.env.PUBLIC_URL + "/checkout"}
                element={<Checkout/>}
              />
              <Route
                path={process.env.PUBLIC_URL + "/Be-a-Premium-Member"}
                element={<PremiumMember/>}
              />

              <Route path="*" element={<NotFound/>} />
            </Routes>
          </Suspense>
        </ScrollToTop>
      </Router>
  );
};

export default App;