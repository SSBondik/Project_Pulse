$(document).ready(function(){

    //Скрипт для карусели
    $('.carousel__inner').slick({
        speed: 1200,
        adaptiveHeight: true,
        prevArrow: '<button type="button" class="slick-prew"><img src="icons/left.svg"></button>',
        nextArrow: '<button type="button" class="slick-next"><img src="icons/right.svg"></button>',
        responsive: [
            {
                breakpoint: 992,
                settings: {
                    arrows: false,
                    dots: true
                }
            }
        ]
    });

    //Скрипт для табов
    $('ul.catalog__tabs').on('click', 'li:not(.catalog__tab_active)', function() {
        $(this)
          .addClass('catalog__tab_active').siblings().removeClass('catalog__tab_active')
          .closest('div.container').find('div.catalog__content').removeClass('catalog__content_active').eq($(this).index()).addClass('catalog__content_active');
    });
    
    //Скрипт для поворота наших карточек
    function toggleSlide(item) {
        $(item).each(function(i) {
            $(this).on('click', function(e) {
                e.preventDefault();
                $('.catalog-item__content').eq(i).toggleClass('catalog-item__content_active');
                $('.catalog-item__list').eq(i).toggleClass('catalog-item__list_active');
            })
        })
    }
    toggleSlide('.catalog-item__link');
    toggleSlide('.catalog-item__back');

    //Модальные окна
    $('[data-modal=consultation]').on('click', function() {
        $('.overlay, #consultation').fadeIn('slow');
    });
    $('.modal__close').on('click', function() {
        $('.overlay, #consultation , #thanks , #order').fadeOut('slow');
    });
    // $('.button_mini').on('click', function() {
    //     $('.overlay, #order').fadeIn('slow');
    // });

    $('.button_mini').each(function(i) {
        $(this).on('click', function() {
            $('#order .modal__descr').text($('.catalog-item__subtitle').eq(i).text());
            $('.overlay, #order').fadeIn('slow');
        });
    });

    //Валидация форм
    function valideForms(form) {
        $(form).validate({
            rules: {
                name: {
                    required: true,
                    minlength: 5
                },
                phone: "required",
                email: {
                    required: true,
                    email: true
                }
            },
            messages: {
                name: {
                    required: "Пожалуйста введите своё имя",
                    minlength: jQuery.validator.format("Введите {0} символов!")
                },
                phone: "Пожалуйста введите свой номер телефона",
                email: {
                    required: "Пожалуйста введите свою почту",
                    email: "Неправильно введен адрес почты"
                }
            }
        });
    };
    valideForms('#consultation-form');
    valideForms('#consultation form');
    valideForms('#order form');

    //Маска ввода номера на сайте
    $('input[name=phone]').mask("+380 (99) 999-9999");

    //Отправка писем с сайта
    $('form').submit(function(e) {
        e.preventDefault(); //отключаем стандартное поведение браузера

        //Конструкция валидатор чтобы не было багов с функцией val("")
        if(!$(this).valid()) { //Если наша функция не проёдет валидацию то мы этот код прекратим, то есть не сможем отправить пустые поля
            return; 
        }  

        $.ajax({ //Отправка данных на сервер
            type:"POST", //Указываем получить данные с сервера или отдать POST - отдать
            url: "mailer/smart.php", //Указываем какой обработчик будет обрабатывать данную операцию
            data: $(this).serialize() //Те данные которые я  хочу отправить на сервер
        }).done(function() { //То что будет после отправки данных на сервер
            $(this).find("input").val(""); //Таким образом после отпраки формы мы очистим поля ввода (val)
            $('#consultation, #order').fadeOut(); //Наши формы будут закрываться
            $('.overlay, #thanks').fadeIn('slow'); //Будет показываться окно благодарности

            $("form").trigger("reset"); //Все мои формы должны очистится
        });
        return false;
    });
});