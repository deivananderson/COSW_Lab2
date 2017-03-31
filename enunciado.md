###Escuela Colombiana de Ingenier�a ###Construcci�n de Software - COSW

####Laboratorio - SPA y Seguridad back-end.

Basado en el material oficial de Spring.

Parte I.

Recupere el proyecto realizado en el ejericicio anterior (la aplicaci�n de 'tareas pendientes').

Cree un API REST que permita (1) registrar tareas pendientes, y (2) consultar las tareas pendientes registradas, es decir, debe soportar peticiones GET y POST (recuerde cumplir con los niveles de madurez de los API REST). Recuerde que puede hacerlo f�cilmente en una nueva clase usando las siguientes anotaciones:

@RestController @RequestMapping("/urldelrecurso") @RequestMapping(value = "/{ruta}", method = RequestMethod.GET)

```
Para implementar el esquema de seguridad de la aplicaci�n, se requiere un recurso con el que se pueda verificar si el cliente tiene acceso a los recursos REST del servidor. Para esto, implemente otro controlador REST con el recurso:?

@RestController
public class UsersController {	

    @RequestMapping("/app/user")
    public Principal user(Principal user) {
        return user;
    }	        
}
Para implementar la funcionalidad de lado del servidor (consulta de tareas, registro de una), cree una interfaz que defina las operaciones requeridas. Agregue al controlador del API Rest un atributo que corresponda al tipo de la interfaz creada, con su respectiva anotaci�n @Autowired.

Implemente un Stub para dicha interfaz (una implementaci�n simulada), el cual mantenga los datos (los TODOs registrados) en memoria. Haga que dicha implementaci�n sea la que se inyecte en el controlador del API REST poniendo en �ste una anotaci�n @Service.

Inicie la aplicaci�n y verifique el funcionamiento del API con el comando curl. Ejemplo para hacer una petici�n POST:

curl -H "Content-Type: application/json" -X POST -d '{"username":"xyz","password":"xyz"}' http://localhost:3000/api/login ``` 6. Habilite el esquema de seguridad de SpringBoot, agregando 'security-starter' como dependencia (en el pom.xml):

```xml
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-security</artifactId>
    </dependency>                
```
Repita el comando anterior, y verifique si a�n es posible acceder directamente al API.

Agregue la siguiente configuraci�n en la clase principal de la aplicaci�n (la que tiene la anotaci�n @SpringBootApplication):

@Configuration @EnableGlobalMethodSecurity(prePostEnabled = true) @Order(SecurityProperties.ACCESS_OVERRIDE_ORDER) protected static class SecurityConfiguration extends WebSecurityConfigurerAdapter {

    @Override
    protected void configure(AuthenticationManagerBuilder builder) throws Exception {
        builder.inMemoryAuthentication().withUser("user").password("password").roles("USER");
    }
    
    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http
                .httpBasic()
                .and()
                .authorizeRequests()
                .antMatchers("/app/**","/logout","/login").permitAll()
                .anyRequest().authenticated().and()
                .logout().logoutSuccessUrl("/")
                .and().csrf()
                .csrfTokenRepository(csrfTokenRepository()).and()
                .addFilterAfter(csrfHeaderFilter(), CsrfFilter.class);
    }

    private Filter csrfHeaderFilter() {
        return new OncePerRequestFilter() {
            @Override
            protected void doFilterInternal(HttpServletRequest request,
                    HttpServletResponse response, FilterChain filterChain)
                    throws ServletException, IOException {
                CsrfToken csrf = (CsrfToken) request.getAttribute(CsrfToken.class
                        .getName());
                if (csrf != null) {
                    Cookie cookie = WebUtils.getCookie(request, "XSRF-TOKEN");
                    String token = csrf.getToken();
                    if (cookie == null || token != null
                            && !token.equals(cookie.getValue())) {
                        cookie = new Cookie("XSRF-TOKEN", token);
                        cookie.setPath("/");
                        response.addCookie(cookie);
                    }
                }
                filterChain.doFilter(request, response);
            }
        };
    }

    private CsrfTokenRepository csrfTokenRepository() {
        HttpSessionCsrfTokenRepository repository = new HttpSessionCsrfTokenRepository();
        repository.setHeaderName("X-XSRF-TOKEN");
        return repository;
    }

}
```
En la SPA (AngularJS), siguiendo el esquema del laboratorio anterior, cree una nueva vista -con su respectivo controlador- para hacer login. Configure el enrutamiento de la nueva vista, y agru�guela a la barra de opciones de la aplicaci�n.

Rectifique que en la configuraci�n del m�dulo principal (el definido en app/app.js) se tenga configurado el par�metro $httpProvider.defaults.headers.common dela siguiente manera:

config(['$routeProvider','$httpProvider', function($routeProvider, $httpProvider) { $routeProvider.otherwise({redirectTo: '/login'}); $httpProvider.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest'; }]); ``` 10. Para la vista de login, use el siguiente formulario:

```html
Username:
Password:
Submit ```
Implemente el controlador de la vista de login. Haga que en dicho controlador se inyecte: $rootScope, $scope, $http y $location.

En el controlador, agregue las funciones authenticate() y login(), junto con la propiedad 'credentials' (la asociada a la vista mediante ng-model):

            var authenticate = function (credentials, callback) {

                var headers = credentials ? {authorization: "Basic "
                            + btoa(credentials.username + ":" + credentials.password)
                } : {};

                $http.get('user', {headers: headers}).success(function (data) {
                    if (data.name) {
                        $rootScope.authenticated = true;
                    } else {
                        $rootScope.authenticated = false;
                    }
                    callback && callback();
                }).error(function () {
                    $rootScope.authenticated = false;
                    callback && callback();
                });

            };

            authenticate();
            $scope.credentials = {};
            $scope.login = function () {
                authenticate($scope.credentials, function () {                        
                    if ($rootScope.authenticated) {
                        $location.path("/");
                        $scope.error = false;
                    } else {
                        $location.path("/login");
                        $scope.error = true;
                    }
                });
            };
Con el esquema planteado, la propiedad de $rootScope.authenticated siempre tendr� un valor de verdadero cuando el usuario est� autenticado, y falso en cualquier otro caso. Use la directiva 'ng-show' para que las vista que muestra las tareas pendientes s�lo lo haga si el usuario es� autenticado:

...
...
```
Verifique el nuevo funcionamiento de la aplicaci�n.

Para implementar el logout, agregue un controlador al m�dulo ra�z (el definido en app/app.js), al cual se le inyecte $scope, $http, $rootScope, y $location. En dicho controlador, defina la funci�n de logout():

$scope.logout = function () { $http.post('/logout', {}).success(function () { $rootScope.authenticated = false; $location.path("/"); }).error(function (data) { $rootScope.authenticated = false; }); }; ``` 17. Al men� de la aplicaci�n, agregue una nueva entrada de men� (href), la cual, en lugar de redirigir a una vista, ejecute el anterior m�todo mediante la directiva ng-click.

Verifique el funcionamiento de la aplicaci�n.
Parte II.

Ahora, va a mantener la informaci�n de las tareas pendientes en el servidor. Para hacer esto, va a usar las facilidades del m�dulo '$resources' de angular.

Agregue la dependencia "angular-resource": "~1.4.0" a bower, y actualice las dependencias de javascript (bower install).

Importe la anterior librer�a, agreg�ndola en app/index.html:

<script src="bower_components/angular-resource/angular-resource.js"></script>
En el m�dulo donde defini� los servicios en el ejercicio anterior, inyecte ngResource como dependencia:

angular.module('services.servicesA', ['ngRoute', 'ngResource']) ```

En el anterior m�dulo agregue un nuevo servicio (factory), el cual retorne un objeto $resource que corresponda a un recurso REST. Por ejemplo, si se tuviera un recurso del tipo /items/{iditem}, la f�brica se definir�a como:

.factory('Items', function($resource) { return $resource('/items/:id'); }); ``` 5. Modifique la funcionalidad de la aplicaci�n para que en lugar de agregar y consultar a una variable del servicio, lo haga al servidor, a trav�s del $resource que puede proveer el nuevo servicio. Revise la documentaci�n de Angular $resource en https://docs.angularjs.org/api/ngResource/service/$resource.

Revise el funcionamiento de la aplicaci�n.