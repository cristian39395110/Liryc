bot.controller("loginController", function($window, $scope, $http, $cookies,$filter,$timeout, $rootScope, $interval, hostValue){

const hostWeb = hostValue; 
    $scope.checkLogin = function(){
        if($cookies.get('rango') !== undefined){
            $window.location.href = hostWeb+"/sidelink/frontend/index.html";
        }
    }

    $scope.mostrarError = false;
    $scope.mostrarForm = true;
    //controlar si el usuario y la contraseña son correctos
    $scope.iniciarSesion = function(){
        $scope.spinner = true;
        $http.post(hostWeb+":8081/login",
        {
            'usuario': $scope.usuario,
            'contrasena': $scope.pass
        }
        ).then(function(response){
            $scope.usuarioCorrecto = response.data;
            
            if($scope.usuarioCorrecto.length > 0){
                $cookies.put('rango', $scope.usuarioCorrecto[0].rango);           
                $cookies.put('usuario', $scope.usuarioCorrecto[0].nombre);
                $timeout(function(){
                    $window.location.href = hostWeb+"/sidelink/frontend/index.html";
                },1000);
                
            }
            else{
                $scope.error = "Usuario o contraseña incorrectos";
                $scope.mostrarError = true;
                $scope.mostrarForm = false;
                $scope.spinner = false;
                $timeout(function(){
                    $scope.error = "Usuario o contraseña incorrectos";
                    
                    $scope.mostrarError = false;
                    $scope.mostrarForm = true;
                },5000);
                
            }
        });
        
       
    }

});