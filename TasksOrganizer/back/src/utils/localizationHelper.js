export const allMessages =
{
    en: {
        SYSTEM_LOGIN: 'Please use system login',
        FACEBOOK_LOGIN: 'Please use facebook login',
        GOOGLE_LOGIN: 'Please use google login',
        EMAIL_NOT_CONFIRMED: "Please confirm your email",
        EMAIL_EXIST: "Email already exists",
        FAIL_GENERATE_TOKEN: "Failed To Generate Token",
        SUCCESS_CREATE_USER: "user created successfully and email sent successfully",
        SUCCESS: "done",
        INVALID_INFO: "in-valid informations",
        FAIL_LOGIN: "Login Failed",
        FAIL: "Somthig went wrong",
        USER_NOT_EXIST: "user does not exist",
        USER_EXIST: "user already exist",
        SUCCESS_LOGGED_IN: "user logged in successfully",
        EMAIL_ALREADY_CONFIRMED: "Email is Already Confirmed",
        FAIL_CONFIRM_EMAIL: "Confiramtion is Failed",
        SUCCESS_CONFIRM_EMAIL: "Email confirmed successfully",
        SUCCESS_DELETE_USER: "user deleted successfully",
        FAIL_DELETE_USER: "failed to delete user",
        SUCCESS_UPDATE_USER: "user updated successfully",
        FAIL_UPDATE_USER: "failed to update user",
        NOTE_DELETE_USER: "user will delete permenantly after 12:00 am",
        FAIL_SEND_EMAIL: "failed to send email",
        FAIL_PASS_MATCHING: "passwords mismatch",
        FAIL_PASS: "invalid password",
        PASSWORD_SAME_AS_OLD_PASSWORD: "this password same as the old password",
        FAIL_UPLOAD_PIC: "upload image failed",
        FAIL_ADD_POST: "failed to add meal",
        SUCCESS_ADD_POST: "meal added successfully",
        FAIL_UPDATE_POST: "failed to update meal",
        SUCCESS_DELETE_POST: "meal deleted successfully",
        FAIL_DELETE_POST: "failed to delete meal",
        SUCCESS_BUY_POST: "your order proceeded successfully",
        FAIL_BUY_POST: "failed to proceed your order ",
        FAIL_SEARCH_POST: "No meals found",
        ALREADY_LIKED: "user already liked this meal",
        ALREADY_NOT_LIKED: "user already not liked this meal",
        SUCCESS_ADD_COMMENT: "successfully added comment",
        NOT_FOUND: "not found by this id",
        NOT_AUTHORIZED: "user not authorized to take action",
        NAME_EXIST: "user name already exists",
        LOGIN_FIRST: "Login first",
        BEARER_KEY: "Invalid Bearer key",
        TOKEN_NOT_EXIST: "Please enter your token",
        VALIDATION_ERROR: "validationError",
        ERROR: "error",
        FILE_VALIDATION_ERROR: "NOT ALLOWED FILES...",
        IN_VALID_URL: "Invalid URL",
        EMAIL_EXIST_NOT_CONFIRMED: "This email already exist but not confirmed",
        NOT_VALID_ACCOUNT: "not valid account",
        VALID_ACCOUNT: "valid account",
        INVALID_CODE: 'in-valid code',
        NOT_WEIGHT: "The quantity must be an integer number because this meal is sold by number, not by weight",
        GENERAL_EXISTENCE: "already exist",
        FILE_IS_REQUIRED: "file is required",
        NOT_ACCEPTED: "You are not accepted",
        EMPTY_CART: "This cart is empty",
        CANCELED: "canceled",
        PAYMENT_FAILED: "payment failed",
        CHEF_ID_REQUIRED: 'chefId is required',
        CHEF_ID_NOT_ALLOWED: 'chefId is not allowed',
        MEAL_ID_REQUIRED: 'mealId is required',
        MEAL_ID_NOT_ALLOWED: 'mealId is not allowed',
        REVIEW_AGAIN: "you can't review AGAIN 🤔🤔 !!!",
        REVIEW_WITH_OUT_TRY: "you can't review this meal before you BUY IT 🤔🤔 !!!",
        CHECK_YOUY_INBOX: "check Your inbox",
        BRAND_EXIST: "Brand Name already exists",
        NATIONALID: 'National ID already exists',
        FRONTID: 'Front ID not exists',
        BACKID: 'Back ID not exists',
        CODE_EXPIRED: "code expire use resend code to get a new code",
        NOT_EXPIRED: "old code not expired yet try again after 2 minute",
        INVALID_PAYLOAD: 'invalid token payload',
        PHONE_EXIST: 'phone already exists',
        PASSWORD_CHANGED: "token expired after change password plz log in again with new password",
        SEND_PHONE_OR_EMAIL: "please send email or phone",
        LOGOUT_SUCCESS:"log out successfully",
        UNAUTHORIZED:"You are not authorized to access this endpoint"
    },
    ar: {
        LOGOUT_SUCCESS:"تم تسجيل الخروج بنجاح",
        SEND_PHONE_OR_EMAIL: "من فضلك قم بإرسال الحساب او رقم الهاتف المحمول",
        PHONE_EXIST: 'رقم الهاتف موجود بالغعل',
        PASSWORD_CHANGED: "هذه التوكن لا يمكن استخدامها لأنك قمت بتغير كلمة السر برجاء تسجيل الدخول بكلمة السر الجديدة واعادة المجاولة",
        INVALID_PAYLOAD: 'خطأ فى حمولة التوكن',
        NOT_EXPIRED: "لم تنتهى صلاحية الكود المرسل بعد انتظر لمدة دقيقتين",
        CODE_EXPIRED: "انتهت صلاحية هذا الكود برجاء استخدام اعادة ارسال الكود للحصول على كود جديد",
        FRONTID: 'صورة البطاقة الأمامية غير مرسلة',
        BACKID: 'صورة البطاقة الخلفية غير مرسلة',
        NATIONALID: 'هذا الرقم القومى موجود بالفعل',
        BRAND_EXIST: "اسم البراند موجود بالفعل",
        SYSTEM_LOGIN: 'من فضلك استخدم تسجيل الدخول الخاص بالنظام',
        FACEBOOK_LOGIN: 'من فضلك استخدم تسجيل الدخول الخاص بالفيس بوك',
        GOOGLE_LOGIN: 'من فضلك استخدم تسجيل الدخول الخاص بجوجل',
        REVIEW_WITH_OUT_TRY: "لا يمكنك التقييم بدون التعامل مع هذا الشيف او شراء الوجبة 🤔🤔 !!!",
        REVIEW_AGAIN: "لا يمكنك التقييم مره اخرى 🤔🤔 !!!",
        CHEF_ID_REQUIRED: 'الكود التعريفي للطباخ مطلوب',
        CHEF_ID_NOT_ALLOWED: 'الكود التعريفي للطباخ غير مسموح به',
        MEAL_ID_REQUIRED: 'الكود التعريفي للوجبة مطلوب',
        MEAL_ID_NOT_ALLOWED: 'الكود التعريفي للوجبة غير مسموح به',
        PAYMENT_FAILED: "فشل الدفع",
        CANCELED: "تم الإلغاء",
        EMPTY_CART: "هذه السلة فارغة",
        NOT_ACCEPTED: "لم يتم قبولك بواسطة الأدمن بعد",
        GENERAL_EXISTENCE: "موجود بالفعل",
        NOT_WEIGHT: "برجاء ادخال رقم صحيح لأن هذه الوجبة تباع العدد ليس بالكمية",
        INVALID_CODE: 'الكود غير صحيح',
        FAIL_PASS: "كلمة السر غير صحيحة",
        PASSWORD_SAME_AS_OLD_PASSWORD: "كلمة السر الجديدة مشابهه للقديمة",
        VALID_ACCOUNT: "الحساب صحيح",
        NOT_VALID_ACCOUNT: "الحساب غير صحيح",
        EMAIL_EXIST_NOT_CONFIRMED: "الحساب مجوجود بالفعل ولكن غير مفعل",
        IN_VALID_URL: "خطأ فى الرابط",
        FILE_VALIDATION_ERROR: "خطأ فى الملف المرسل",
        FILE_IS_REQUIRED: "الملف مطلوب",
        ERROR: "خطأ",
        VALIDATION_ERROR: "خطأ فى الداتا المرسلة",
        TOKEN_NOT_EXIST: "من فضلك ارسل التوكن",
        UNAUTHORIZED: 'غير مسموح لك بالدخول لهذه الصفحة',
        BEARER_KEY: "خطأ فى التوكن",
        LOGIN_FIRST: "قم بتسجيل الدخول اولاً",
        EMAIL_NOT_CONFIRMED: "برجاء تفعيل حسابك",
        EMAIL_EXIST: "الايميل موجود بالفعل",
        FAIL_GENERATE_TOKEN: "فشل في إنشاء الرمز",
        SUCCESS_CREATE_USER: " تم إنشاء الحساب بنجاح وتم إرسال رمز التفعيل على الايميل",
        INVALID_INFO: "المعلومات غير صحيحه",
        FAIL_LOGIN: "حدث خطأ تعذر الدخول إلى الحساب",
        FAIL: "حدث خطأ ",
        SUCCESS: "تمت العملية بنجاح",
        USER_NOT_EXIST: "المستخدم غير موجود",
        USER_EXIST: "المستخدم موجود من قبل",
        SUCCESS_LOGGED_IN: "تم تسجيل الدخول بنجاح",
        EMAIL_ALREADY_CONFIRMED: "الحساب مفعل من قبل",
        FAIL_CONFIRM_EMAIL: "حدث خطأ يتعذر تفعيل الحساب ",
        SUCCESS_CONFIRM_EMAIL: "تم تفعيل الحساب",
        SUCCESS_DELETE_USER: "تم حذف الحساب بنجاح",
        FAIL_DELETE_USER: "حدث خطأ أثناء حذف الحساب",
        SUCCESS_UPDATE_USER: "تم تحديث بيانات الحساب بنجاح",
        FAIL_UPDATE_USER: "حدث خطأ أثناء تحديث بيانات الحساب",
        NOTE_DELETE_USER: "تنبيه سيتم حذف البيانات نهائياً الساعه 12:00 صباحاً",
        FAIL_SEND_EMAIL: "حدث خطأ أثناء إرسال الايميل",
        FAIL_PASS_MATCHING: "الرمز القديم غي صحيح",
        FAIL_UPLOAD_PIC: "حدث خطأ أثناء رفع الصوره",
        SUCCESS_ADD_POST: "تم اضافة الوجبة بنجاح",
        FAIL_ADD_POST: "حدث خطأ اثناء اضافة الوجبة",
        SUCCESS_UPDATE_POST: "تم تحديث معلومات الوجبة بنجاح",
        FAIL_UPDATE_POST: "حدث خطأ اثناء تحديث معلومات الوجبة ",
        SUCCESS_DELETE_POST: "تم مسح الوجبة بنجاح ",
        FAIL_DELETE_POST: "حدث خطأ اثناء مسح الوجبة",
        SUCCESS_BUY_POST: "تم شراء طلبك بنجاح ",
        FAIL_BUY_POST: "حدث خطأاثناء الشراء ",
        FAIL_SEARCH_POST: "لم يتم العثور علي الوجبة ",
        ALREADY_LIKED: "المستخدم معجب بالمنشور من قبل",
        ALREADY_NOT_LIKED: "المستخدم لم يعجبه المنشور من قبل",
        SUCCESS_ADD_COMMENT: "تمت إضافة تعليق بنجاح",
        NOT_FOUND: "ما تبحث عنه غير موجود",
        NOT_AUTHORIZED: "غير مصرح للمستخدم بإتخاز القرار",
        NAME_EXIST: "الإسم مستخدم من قبل",
        CHECK_YOUY_INBOX: "تفحص حسابك الشخصى",

    }

}

