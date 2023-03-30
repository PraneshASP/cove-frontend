import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import Prism from 'prismjs';
import 'prismjs/components/prism-json';
import { Head } from '@/components/layout/Head';

type FormData = {
  contract_address: string;
  repo_url: string;
  repo_commit: string;
};

const Verify: React.FC = () => {
  const router = useRouter();
  useEffect(() => {
    Prism.highlightAll();
  }, []);

  const [data, setData] = useState<FormData>({
    repo_url: 'https://github.com/ProjectOpenSea/seaport',
    repo_commit: 'd58a91d218b0ab557543c8a292710aa36e693973',
    contract_address: '0x00000000000001ad428e4906aE43D8F9852d0dD6',
  });

  const [result, setResult] = useState<string>('');
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      setResult('');
      const response = await axios.post('http://localhost:8000/verify', {
        contract_address: data.contract_address,
        repo_url: data.repo_url,
        repo_commit: data.repo_commit,
      });
      if (response.status === 200) {
        setResult(response.data);
      } else {
        setResult(`Error: ${response.statusText}`);
      }
    } catch (error: any) {
      setResult(error.message);
    }
  };

  return (
    <div className='Verify'>
      <div className='input-fields'>
        {Object.keys(data).map((key) => (
          <div key={key}>
            <label htmlFor={key}>
              {key === 'repo_url'
                ? 'Repo URL'
                : key === 'repo_commit'
                ? 'Repo Commit'
                : key === 'contract_address'
                ? 'Contract Address'
                : key}
              :{' '}
            </label>
            <input
              type='text'
              id={key}
              name={key}
              value={(data as any)[key]}
              onChange={handleChange}
            />
          </div>
        ))}
      </div>
      <button className='verify-button' onClick={handleSubmit}>
        Verify Contract
      </button>
      {result && (
        <pre style={{ maxWidth: '100vw', overflowX: 'auto' }}>
          <code className='language-json' id='json'>
            {result ? JSON.stringify(result, null, 2) : ''}
          </code>
        </pre>
      )}
    </div>
  );
};

export default Verify;