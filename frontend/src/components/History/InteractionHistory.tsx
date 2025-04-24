import React, { useState, useEffect } from 'react';
import { getUserHistory } from '../../services/api';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { ClipLoader } from 'react-spinners';

// Define the interaction type based on the backend model
interface Interaction {
  id: string;
  agent_type: string;
  question: string;
  answer: string;
  timestamp: string;
}

export const InteractionHistory: React.FC = () => {
  const [interactions, setInteractions] = useState<Interaction[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState<number>(0);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const pageSize = 10;

  // Function to get agent name from agent_type
  const getAgentName = (agentType: string): string => {
    switch (agentType) {
      case 'exam-analyzer':
        return 'Análise de Exames';
      case 'exam-follow-up':
        return 'Perguntas sobre Exame';
      case 'medication-info':
        return 'Consulta de Bulas';
      case 'medication-prices':
        return 'Busca de Remédios';
      case 'general-question':
        return 'Avaliação de Dúvidas';
      default:
        return agentType;
    }
  };

  // Function to format date
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  // Load interactions when component mounts
  useEffect(() => {
    fetchInteractions();
  }, []);

  const fetchInteractions = async (newPage = 0) => {
    try {
      setLoading(true);
      setError(null);
      
      const offset = newPage * pageSize;
      const data = await getUserHistory(pageSize, offset);
      
      if (newPage === 0) {
        setInteractions(data);
      } else {
        setInteractions(prev => [...prev, ...data]);
      }
      
      // Check if there are more interactions to load
      setHasMore(data.length === pageSize);
      setPage(newPage);
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar histórico de interações');
    } finally {
      setLoading(false);
    }
  };

  const loadMore = () => {
    if (!loading && hasMore) {
      fetchInteractions(page + 1);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Seu Histórico de Interações</h1>
      
      {error && (
        <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-6">
          {error}
        </div>
      )}
      
      {loading && page === 0 ? (
        <div className="flex justify-center py-12">
          <ClipLoader size={50} color="#1760C6" />
        </div>
      ) : interactions.length === 0 ? (
        <Card className="p-6 text-center">
          <p className="text-gray-600">Você ainda não tem interações registradas.</p>
        </Card>
      ) : (
        <>
          <div className="space-y-6">
            {interactions.map((interaction) => (
              <Card key={interaction.id} className="p-6 shadow-md">
                <div className="flex flex-col gap-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="inline-block bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
                        {getAgentName(interaction.agent_type)}
                      </span>
                      <span className="ml-3 text-sm text-gray-500">
                        {formatDate(interaction.timestamp)}
                      </span>
                    </div>
                  </div>
                  
                  <div className="mt-2">
                    <h3 className="text-lg font-semibold text-gray-800">Pergunta:</h3>
                    <p className="mt-1 text-gray-700 whitespace-pre-wrap">{interaction.question}</p>
                  </div>
                  
                  <div className="mt-2">
                    <h3 className="text-lg font-semibold text-gray-800">Resposta:</h3>
                    <div 
                      className="mt-1 text-gray-700 prose max-w-none"
                      dangerouslySetInnerHTML={{ __html: interaction.answer.replace(/\n/g, '<br>') }}
                    />
                  </div>
                </div>
              </Card>
            ))}
          </div>
          
          {hasMore && (
            <div className="flex justify-center mt-8">
              <Button 
                onClick={loadMore} 
                disabled={loading}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                {loading ? (
                  <><ClipLoader size={16} color="#ffffff" /> <span className="ml-2">Carregando...</span></>
                ) : (
                  'Carregar Mais'
                )}
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
};