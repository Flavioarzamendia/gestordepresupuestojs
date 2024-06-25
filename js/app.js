// variables y selectores 
const formulario = document.querySelector('#agregar-gasto');
const gastoListado = document.querySelector('#gastos ul')


//Eventos
eventListeners();
function eventListeners (){
    document.addEventListener('DOMContentLoaded', preguntarPresupuesto);
    formulario.addEventListener('submit', agregarGasto);
}

//clases
//presupuesto
class Presupuesto {
    constructor (presupuesto){
        this.presupuesto = Number(presupuesto);
        this.restante = Number(presupuesto);
        this.gastos = [];

    }

    nuevoGasto (gasto){
        this.gastos = [...this.gastos, gasto];
        this.calcularRestante();
        
    }
    calcularRestante(){
        const gastado = this.gastos.reduce( (total , gasto) => total+gasto.cantidad, 0);
        this.restante = this.presupuesto - gastado;
        

    }
    eliminarGasto(id){
        this.gastos = this.gastos.filter( gasto =>gasto.id !== id);
        this.calcularRestante();

    }
}

//user interface 
class UI {
    insertarPresupuesto(cantidad) {
        const {presupuesto, restante} = cantidad;
        document.querySelector('#total').textContent = presupuesto;
        document.querySelector('#restante').textContent = restante;
    }

    impimirAlerta(mensaje, tipo){
        //crear el div
        const divMensaje = document.createElement('div');
        divMensaje.classList.add('text-center', 'alert');

        if(tipo === 'error'){
            divMensaje.classList.add('alert-danger');

        }else{
            divMensaje.classList.add('alert-success');
        }

        //mensaje de error
        divMensaje.textContent = mensaje;
        //insertar html

        document.querySelector('.primario').insertBefore(divMensaje, formulario);

        setTimeout(() => {
            divMensaje.remove();
        }, 3000);
    }

    agregarGastoListado(gastos){
        //iterar sobre gastos 
            this.limpiarHTML();
        gastos.forEach(gasto=> {
           const {cantidad , nombre, id} = gasto;

           //crear li
            const nuevoGasto = document.createElement('li');
            nuevoGasto.className = 'list-group-item d-flex justify-content-between align-items-center';
            nuevoGasto.dataset.id = id;

           //agregar el html del gasto
            nuevoGasto.innerHTML = `${nombre} <span class="badge badge-primary badge-pill"> $${cantidad} </span>`
           //boton para agregar gasto
            const btnBorrar = document.createElement('button');
            btnBorrar.classList.add('btn', 'btn-danger', 'borrar-gasto');
            btnBorrar.innerHTML = 'Borrar &times;'
            nuevoGasto.appendChild(btnBorrar);
            btnBorrar.onclick = () =>{
                eliminarGasto(id);
            }
           //agregar al html
           gastoListado.appendChild(nuevoGasto);
        });
    }
    limpiarHTML(){
            while(gastoListado.firstChild){
                gastoListado.removeChild(gastoListado.firstChild)
            }
    }
    actualizarRestante(restante){
        document.querySelector('#restante').textContent = restante;
    }
    comprobarPresupuesto(presupuestObj){
        const {presupuesto, restante} = presupuestObj;

        const restantediv = document.querySelector('.restante');
        // comprobar 25%

        if( (presupuesto / 4) > restante ){
            restantediv.classList.remove('alert-success', 'alert-warning');
           restantediv.classList.add('alert-danger');
        }else if((presupuesto / 2) > restante){
            restantediv.classList.remove('alert-success');
            restantediv.classList.add('alert-warning');
        }else {
            restantediv.classList.remove('alert-danger', 'alert-warning');
            restantediv.classList.add('alert-success');
        }

        if(restante <= 0){
            ui.impimirAlerta('Presupuesto agotado');
            formulario.querySelector('button[type="submit"]').disabled = true;
        }else{
            formulario.querySelector('button[type="submit"]').disabled = false;
        }

        
    }
}

let presupuesto;

//instanciar 
const ui = new UI ();

// funciones 

function preguntarPresupuesto (){
    const presupuestoUsuario = prompt('cual es tu presupuesto');
    

    if(presupuestoUsuario === "" || presupuestoUsuario === null || presupuestoUsuario <= 0 || isNaN(presupuestoUsuario)){
        window.location.reload()
    }
    presupuesto = new Presupuesto(presupuestoUsuario);
    
    ui.insertarPresupuesto(presupuesto)
}


function agregarGasto (e){
    e.preventDefault();


    //leer los inputs del formulario

    const nombre = document.querySelector('#gasto').value;
    const cantidad = Number(document.querySelector('#cantidad').value);

    if(cantidad ==='' || nombre ===''){
        ui.impimirAlerta('Ambos campos son obligatorios', 'error');
        return;
    } else if(cantidad <=0 || isNaN(cantidad)){
        ui.impimirAlerta('Cantidad no valida', 'error');
        return;
    }
    
    //generar el bjeto gasto

    const gasto ={nombre, cantidad, id: Date.now()};
   

    //añade un nuevo gasto
    presupuesto.nuevoGasto(gasto);  
    //imprimir alerta 

    ui.impimirAlerta('Gasto agregado correctamente');

    //imprimir los gastos
    const {gastos, restante} = presupuesto;
    ui.agregarGastoListado(gastos);
    ui.actualizarRestante(restante);

    ui.comprobarPresupuesto(presupuesto);

    //reinicia el formulario
    formulario.reset();
}

function eliminarGasto(id){
   presupuesto.eliminarGasto(id);
   const{gastos , restante } = presupuesto;
   ui.agregarGastoListado(gastos);
   ui.actualizarRestante(restante);

   ui.comprobarPresupuesto(presupuesto);
}