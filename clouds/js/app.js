$( document ).ready(function() {

    $(".product_item").click(function(){
        $('.product_item').removeClass("focused");
        $(this).toggleClass("focused");
    });

    //dropdawn info
    $('.title_dropdown__info').click( function () {
        const question = $(this).parent();
        question.toggleClass('active');
        question.find('.default-submenu').slideToggle();
    });

    //formstyler
    $('.styler').styler();

    //menu
    $(".menu_box").click(function(){
        $(this).toggleClass("is-active");
        $(this).find('.hamburger').toggleClass("is-active");
        $('.mob_nav').toggleClass('is-active');
    });

    $('.carousel').not('.unslick').each(function () {
        var slickInduvidual = $(this);
        var slideCount = null;
        slickInduvidual.on('init', function (event, slick) {
            slideCount = slick.slideCount;
            setSlideCount();
            setCurrentSlideNumber(slick.currentSlide);
        });
        slickInduvidual.on('beforeChange', function (event, slick, currentSlide, nextSlide) {
            setCurrentSlideNumber(nextSlide);
        });
        slickInduvidual.slick({
            infinite: false,
            arrows: true,
            slidesToShow: +$(this).attr('data-items-xl'),
            slidesToScroll: +$(this).attr('data-scroll-xl'),
            responsive: [{
                breakpoint: 1920,
                settings: {
                    slidesToShow: +$(this).attr('data-items-xl'),
                    slidesToScroll: +$(this).attr('data-scroll-xl'),
                }
            },
            {
                breakpoint: 1365,
                settings: {
                    slidesToShow: +$(this).attr('data-items-lg'),
                    slidesToScroll: +$(this).attr('data-scroll-lg'),
                }
            },
            {
                breakpoint: 992,
                settings: {
                    slidesToShow: +$(this).attr('data-items-md'),
                    slidesToScroll: +$(this).attr('data-scroll-md'),
                }
            },
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: +$(this).attr('data-items-sm'),
                    slidesToScroll: +$(this).attr('data-scroll-sm'),
                }
            }
            ]
        });

        function setSlideCount() {
            var $el = slickInduvidual.closest('.section').find('.to');
            $el.text((slideCount > 9) ? slideCount : '' + +slideCount);
        }

        function setCurrentSlideNumber(currentSlide) {
            var $el = slickInduvidual.closest('.section').find('.from');
            $el.text((currentSlide > 8) ? currentSlide + 1 : '' + +(currentSlide + 1));
        }


        $(' button.prev').click(function () {
            $(this).closest('.section').find(".carousel").slick('slickPrev');
        });
        $(' button.next').click(function () {
            $(this).closest('.section').find(".carousel").slick('slickNext');
        });
        //console.log(slideCount);
    });   
});

document.addEventListener("DOMContentLoaded", function() {
    const productWrappers = document.querySelectorAll('.product_wrapper');
    const totalCost = document.querySelectorAll('.js-total')
    let SILVER_INC = 0, GOLD_INC = 0 //инкремент цены для тарифов Silver и Gold
    
    function changeTotalCost(value, el) {
            let num = el.innerHTML.replaceAll('₽', '').trim()
            el.innerHTML = +num + +value
            el.innerHTML += ' ₽'
    }
    
    function isSilver(element) {
        return element.closest('.tab-pane').id=='firstTab'
    }


    productWrappers.forEach(productWrapper => {
        const productItems = productWrapper.querySelectorAll('.product_item');
        const showTariffsBtn = productWrapper.querySelector('.show_tariffs');
        const maxVisibleItems = 3;

        if (productItems.length > maxVisibleItems) {
            for (let i = maxVisibleItems; i < productItems.length; i++) {
                productItems[i].style.display = 'none';
            }

            showTariffsBtn.style.display = 'block';

            let isHidden = true;
            showTariffsBtn.addEventListener('click', function(event) {
                event.preventDefault();

                for (let i = maxVisibleItems; i < productItems.length; i++) {
                    productItems[i].style.display = isHidden ? 'block' : 'none';
                }

                showTariffsBtn.textContent = isHidden ? 'Скрыть тарифы' : 'Показать все тарифы';
                isHidden = !isHidden;
            });
        } else {
            showTariffsBtn.style.display = 'none';
        }
        //new
        //увеличение цены при нажатии на тариф
        productItems.forEach(el=>{
            el.addEventListener('click', (event)=> {
                if (el.closest('.tab-pane').querySelector('.js-active-product')) { 
                    el.closest('.tab-pane').querySelector('.js-active-product').classList.remove('js-active-product')                  
                }
                    event.currentTarget.closest('.product_item').classList.add('js-active-product')
                    changeTotalCost(isSilver(el)?-SILVER_INC:-GOLD_INC, isSilver(el)?totalCost[0]:totalCost[1])
                    var temp = el.querySelector('.price').textContent.trim()
                    if (isSilver(el)) {
                        SILVER_INC = temp.split('₽')[0].replaceAll(' ', '')
                    } else {
                        GOLD_INC = temp.split('₽')[0].replaceAll(' ', '')
                    }
                    console.log(SILVER_INC);
                    changeTotalCost(isSilver(el)?SILVER_INC:GOLD_INC, isSilver(el)?totalCost[0]:totalCost[1])                
            })
        })
    });

    //new
    function clickRadio(el) {
        var siblings = document.querySelectorAll("input[type='radio'][name='" + el.name + "']");
        for (var i = 0; i < siblings.length; i++) {
          if (siblings[i] != el)
            siblings[i].oldChecked = false;
        }
        if (el.oldChecked) {
            clearRecomends()
            el.checked = false
        }         
        el.oldChecked = el.checked;
        el.checked = false
    }
    //поиск нажатой функции среди конфига тарифов и установка рекомендаций
    const filterButtons = document.querySelectorAll('.form_radio_btn')
    filterButtons.forEach(el=>{
        el.querySelector('label').addEventListener('click', function(event) {
            let type = event.currentTarget.previousElementSibling.value.trim()
            let id = event.currentTarget.previousElementSibling.id
            if (isSilver(this)) {
                let config = configRadioSilver.find(item => item.name == type)
                if (config) { setRecomends(config.recomends, false, '', event.currentTarget.previousElementSibling); return }
                else { config = configRadioGold.find(item => item.name == type) }
                if (config) { setRecomends(config.recomends, 2, id[id.length-1], event.currentTarget.previousElementSibling) }
            } else {
                let config = configRadioGold.find(item => item.name == type)
                if (config) { setRecomends(config.recomends, false, '', event.currentTarget.previousElementSibling); return }
                else { config = configRadioSilver.find(item => item.name == type) }
                if (config) { setRecomends(config.recomends, 1, id[id.length-1], event.currentTarget.previousElementSibling) }
            }
        })
    })
    
    //config - ['X2:более 15', 'X4:более 15', 'X6:более 15', 'X8:более 15']
    //функция установки рекомендайций в соответствии с конфигом
    function setRecomends(config, isChange=false, id='', param) {        
        if (isChange) {document.querySelectorAll('.nav-tabs .nav-item')[isChange-1].firstElementChild.click()}
        clearRecomends()
        let activeTab = document.querySelector('.tab-pane.active')
        if (id) {activeTab.querySelectorAll('.form_radio_btn input')[id-1].checked = true}
        config.forEach(item => {
            if (item.indexOf(':') != -1) {
                let prod = activeTab.querySelector(`.product_item[data-type="${item.split(":")[0]}"]`)
                prod.classList.add('product_item__active')
                prod.querySelector('.product_item__top small').innerHTML = item.split(":")[1]
            } else {
                let prod = activeTab.querySelector(`.product_item[data-type="${item}"]`)
                prod.classList.add('product_item__active')
                prod.querySelector('.product_item__top span').classList.add('none')
            }
        })
        clickRadio(param)
        activeTab.querySelectorAll('.product_item').forEach(el=>{
            if (!el.classList.contains('product_item__active')) {
                el.classList.add('none')
            }
        })
    }

    //очистка всех полей тарифа от изменений
    function clearRecomends() {
        document.querySelectorAll('.product_item__active').forEach(el=>{
            el.classList.remove('product_item__active')
        })
        document.querySelectorAll('.product_item.none').forEach(el=>{
            el.classList.remove('none')
        })
        document.querySelectorAll('.product_item__top span.none').forEach(el=>{
            el.classList.remove('none')
        })
    }



    //работа калькулятора
    document.querySelectorAll('.js-switch-reserve').forEach(el=>{
        el.addEventListener('change', function() {
            if (this.checked) {
                changeTotalCost(90*3, isSilver(this)?totalCost[0]:totalCost[1])
            } else {
                changeTotalCost(-90*3, isSilver(this)?totalCost[0]:totalCost[1])
            }
        })
    })
    document.querySelectorAll('.product_summary .jq-number__spin.plus').forEach(el=>{
        el.addEventListener('click', (event)=> {
            // let inc = event.currentTarget.parentElement.querySelector('.jq-number__field input').value
            changeTotalCost(400, isSilver(el)?totalCost[0]:totalCost[1])
        })
    })
    document.querySelectorAll('.product_summary .jq-number__spin.minus').forEach(el=>{
        el.addEventListener('click', (event)=> {
            let inc = event.currentTarget.parentElement.querySelector('.jq-number__field input').value
            if (inc==0) { return }
            if (inc==1) { event.currentTarget.parentElement.querySelector('.jq-number__field input').value=0 }
            changeTotalCost(-400, isSilver(el)?totalCost[0]:totalCost[1])
        })
    })
    document.querySelectorAll('.js-switch-anti').forEach(el=>{
        el.addEventListener('change', function() {
            if (this.checked) {
                changeTotalCost(315, isSilver(this)?totalCost[0]:totalCost[1])
            } else {
                changeTotalCost(-315, isSilver(this)?totalCost[0]:totalCost[1])
            }
        })
    })
});
