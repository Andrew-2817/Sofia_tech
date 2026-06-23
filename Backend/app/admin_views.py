from sqladmin import BaseView, expose
from starlette.responses import RedirectResponse

class ProductRedirectView(BaseView):
    name = "Товары (кастомная)"
    icon = "fa-solid fa-box"

    @expose("/custom-products", methods=["GET"])
    async def redirect_to_products(self, request):
        # Перенаправляем на вашу кастомную админку товаров
        return RedirectResponse(url="/admin-custom/products")