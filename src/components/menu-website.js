import React, { useState } from 'react';
import { Search, Mic, Camera, Upload, Clock, Calendar, ChefHat, ShoppingBag, Heart, Bell, Menu, X, User } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './card-components';

const MenuWebsite = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [isRecording, setIsRecording] = useState(false);
  const [showAddRecipe, setShowAddRecipe] = useState(false);
  const [addRecipeMethod, setAddRecipeMethod] = useState(null);

  const RecipeForm = () => (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h3 className="text-xl font-arsenal text-[#2d3d23] mb-6">Agregar Nueva Receta</h3>
      
      <div className="grid grid-cols-4 gap-4 mb-6">
        <button 
          onClick={() => setAddRecipeMethod('pdf')}
          className="p-4 border-2 border-[#5c6861] rounded-lg hover:bg-[#f4f4f4] transition-colors"
        >
          <Upload className="mx-auto mb-2" />
          <span className="font-arsenal">Subir PDF</span>
        </button>
        <button 
          onClick={() => setAddRecipeMethod('photo')}
          className="p-4 border-2 border-[#5c6861] rounded-lg hover:bg-[#f4f4f4] transition-colors"
        >
          <Camera className="mx-auto mb-2" />
          <span className="font-arsenal">Capturar/Subir Foto</span>
        </button>
        <button 
          onClick={() => setAddRecipeMethod('write')}
          className="p-4 border-2 border-[#5c6861] rounded-lg hover:bg-[#f4f4f4] transition-colors"
        >
          <ChefHat className="mx-auto mb-2" />
          <span className="font-arsenal">Escribir Receta</span>
        </button>
        <button 
          onClick={() => setAddRecipeMethod('voice')}
          className="p-4 border-2 border-[#5c6861] rounded-lg hover:bg-[#f4f4f4] transition-colors"
        >
          <Mic className="mx-auto mb-2" />
          <span className="font-arsenal">Grabación de Voz</span>
        </button>
      </div>

      {addRecipeMethod === 'write' && (
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Nombre de la Receta"
            className="w-full p-2 border border-[#989ca0] rounded-lg font-arsenal"
          />
          
          <div className="border border-[#989ca0] rounded-lg p-4">
            <h4 className="font-arsenal text-lg mb-2">Ingredientes</h4>
            <button className="text-[#3c4c42] font-arsenal hover:underline">
              + Agregar Ingrediente
            </button>
          </div>

          <div className="border border-[#989ca0] rounded-lg p-4">
            <h4 className="font-arsenal text-lg mb-2">Procedimiento</h4>
            <textarea 
              className="w-full p-2 border border-[#989ca0] rounded-lg font-arsenal"
              rows="4"
              placeholder="Describe los pasos..."
            />
            <button className="text-[#3c4c42] font-arsenal hover:underline mt-2">
              + Agregar Paso
            </button>
          </div>

          <div className="flex justify-between">
            <button className="bg-[#3c4c42] text-white px-6 py-2 rounded-lg font-arsenal">
              Vista Previa
            </button>
            <button className="bg-[#2d3d23] text-white px-6 py-2 rounded-lg font-arsenal">
              Guardar Receta
            </button>
          </div>
        </div>
      )}

      {addRecipeMethod === 'voice' && (
        <div className="text-center p-8 border-2 border-dashed border-[#989ca0] rounded-lg">
          <button 
            onClick={() => setIsRecording(!isRecording)}
            className={`p-8 rounded-full ${isRecording ? 'bg-red-500' : 'bg-[#3c4c42]'} text-white mb-4`}
          >
            <Mic size={32} />
          </button>
          <p className="font-arsenal text-[#5c6861]">
            {isRecording ? 'Grabando...' : 'Presiona para comenzar a grabar'}
          </p>
        </div>
      )}
    </div>
  );

  const NutritionalInfo = () => (
    <div className="bg-[#f4f4f4] p-4 rounded-lg">
      <h4 className="font-arsenal text-lg text-[#2d3d23] mb-4">Información Nutricional</h4>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <h5 className="font-arsenal font-bold mb-2">Macronutrientes</h5>
          <ul className="space-y-2 font-arsenal">
            <li>Proteínas: 25g</li>
            <li>Carbohidratos: 45g</li>
            <li>Grasas: 15g</li>
          </ul>
        </div>
        
        <div>
          <h5 className="font-arsenal font-bold mb-2">Micronutrientes</h5>
          <ul className="space-y-2 font-arsenal">
            <li>Vitamina A: 800μg</li>
            <li>Hierro: 4.5mg</li>
            <li>Calcio: 200mg</li>
          </ul>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f4f4f4] font-arsenal">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="text-2xl font-arsenal text-[#3c4c42]">The Menu Company</div>
            <div className="flex space-x-6">
              {['home', 'planear', 'explorar', 'mi perfil', 'contacto'].map((item) => (
                <button 
                  key={item}
                  className={`px-4 py-2 rounded-lg font-arsenal ${
                    activeTab === item ? 'bg-[#5c6861] text-white' : 'text-[#3c4c42]'
                  }`}
                  onClick={() => setActiveTab(item)}
                >
                  {item.charAt(0).toUpperCase() + item.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Recipe Explorer */}
        {activeTab === 'explorar' && (
          <section className="mb-12">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="text-2xl font-arsenal text-[#3c4c42]">
                    Explorador de Recetas
                  </CardTitle>
                  <button 
                    onClick={() => setShowAddRecipe(!showAddRecipe)}
                    className="bg-[#3c4c42] text-white px-6 py-2 rounded-lg font-arsenal"
                  >
                    Agregar mis Recetas
                  </button>
                </div>
              </CardHeader>
              <CardContent>
                {showAddRecipe ? (
                  <RecipeForm />
                ) : (
                  <>
                    <div className="flex mb-6">
                      <div className="relative flex-1">
                        <input 
                          type="text"
                          placeholder="Buscar recetas..."
                          className="w-full px-4 py-2 rounded-lg border border-[#989ca0] focus:outline-none focus:border-[#3c4c42] font-arsenal"
                        />
                        <Search className="absolute right-3 top-2.5 text-[#989ca0]" />
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-6">
                      {[1, 2, 3].map((i) => (
                        <Card key={i} className="overflow-hidden">
                          <img src="/api/placeholder/320/200" alt="Recipe" className="w-full" />
                          <CardContent className="p-4">
                            <h3 className="font-arsenal font-semibold text-[#3c4c42] mb-2">
                              Receta Saludable {i}
                            </h3>
                            <NutritionalInfo />
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </section>
        )}

        {/* Weekly Planner with AI Recommendations */}
        {activeTab === 'planear' && (
          <section>
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="text-2xl font-arsenal text-[#3c4c42]">Tu Plan Semanal</CardTitle>
                  <button className="flex items-center text-[#3c4c42] font-arsenal">
                    <Bell className="mr-2" />
                    Recordarme
                  </button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-7 gap-4">
                  {['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'].map((day) => (
                    <div key={day} className="text-center">
                      <div className="font-arsenal font-semibold text-[#3c4c42] mb-2">{day}</div>
                      <Card className="p-2">
                        <div className="bg-[#f4f4f4] rounded-lg p-2 mb-2">
                          <p className="text-sm font-arsenal text-[#5c6861]">Recomendado por IA</p>
                        </div>
                      </Card>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </section>
        )}
      </main>
    </div>
  );
};

export default MenuWebsite;
